
// PDF text extraction utility
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Try using a simple binary to text conversion approach
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string and extract readable text
    let text = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    
    // Process in chunks to find readable text
    for (let i = 0; i < uint8Array.length; i += 1000) {
      const chunk = uint8Array.slice(i, i + 1000);
      const chunkText = decoder.decode(chunk);
      
      // Extract readable ASCII characters
      const readableText = chunkText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (readableText.length > 10) {
        text += readableText + ' ';
      }
    }
    
    // Clean up the extracted text
    text = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.\-+(),:;!?'"]/g, ' ')
      .trim();
    
    if (text.length < 50) {
      throw new Error('Unable to extract sufficient text from PDF. Please try converting to a text file or Word document.');
    }
    
    return text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please try uploading a Word document or text file instead.');
  }
};

export const extractTextFromWordDoc = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let text = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    
    // Process Word document binary
    for (let i = 0; i < uint8Array.length; i += 500) {
      const chunk = uint8Array.slice(i, i + 500);
      const chunkText = decoder.decode(chunk);
      
      const readableText = chunkText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (readableText.length > 5) {
        text += readableText + ' ';
      }
    }
    
    text = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.\-+(),:;!?'"]/g, ' ')
      .trim();
    
    if (text.length < 50) {
      throw new Error('Unable to extract sufficient text from Word document. Please try saving as a text file.');
    }
    
    return text;
  } catch (error) {
    console.error('Word document extraction error:', error);
    throw new Error('Failed to extract text from Word document. Please try uploading a text file instead.');
  }
};
