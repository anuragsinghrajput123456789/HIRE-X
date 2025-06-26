import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData } from '../types/resumeTypes';

const genAI = new GoogleGenerativeAI('AIzaSyAHI6dEYABoLBXht70PtS97_fPFruDipH8');

export interface AnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  formatSuggestions: string[];
  improvements: string[];
  matchingJobRoles: string[];
}

// Retry utility function
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryableError = error.status === 503 || error.status === 429 || 
                              error.message?.includes('overloaded') || 
                              error.message?.includes('quota');
      
      if (isLastAttempt || !isRetryableError) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

export const analyzeResume = async (resumeText: string): Promise<AnalysisResult> => {
  try {
    console.log('Starting resume analysis with text length:', resumeText.length);
    
    // Clean and validate the resume text
    const cleanedText = resumeText
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000); // Limit text size to avoid API limits
    
    if (cleanedText.length < 100) {
      throw new Error('Resume text is too short for meaningful analysis. Please ensure the document was uploaded correctly.');
    }
    
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume text and provide a detailed analysis in JSON format.

Resume Text:
${cleanedText}

Provide your analysis as a valid JSON object with exactly this structure:
{
  "atsScore": <number between 0-100>,
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "formatSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "matchingJobRoles": ["role1", "role2", "role3"]
}

Focus on:
1. ATS compatibility and keyword optimization
2. Format and structure improvements
3. Content enhancement suggestions
4. Relevant job roles this resume would match

Ensure the response is valid JSON only, no additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });
    
    console.log('Raw AI response:', result);
    
    // Parse JSON response
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate the structure
        if (typeof parsed.atsScore === 'number' && 
            Array.isArray(parsed.missingKeywords) &&
            Array.isArray(parsed.formatSuggestions) &&
            Array.isArray(parsed.improvements) &&
            Array.isArray(parsed.matchingJobRoles)) {
          
          console.log('Analysis completed successfully:', parsed);
          return parsed;
        }
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
    }
    
    // Fallback response if parsing fails
    console.log('Using fallback analysis response');
    return {
      atsScore: 65,
      missingKeywords: ['Industry-specific keywords', 'Technical skills', 'Action verbs', 'Quantifiable achievements'],
      formatSuggestions: ['Use bullet points consistently', 'Include quantifiable achievements', 'Optimize section headers for ATS', 'Ensure proper formatting'],
      improvements: ['Add more specific achievements with metrics', 'Include relevant industry keywords', 'Improve job descriptions with action verbs', 'Enhance skills section'],
      matchingJobRoles: ['Software Developer', 'Data Analyst', 'Project Manager', 'Business Analyst']
    };
    
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      throw new Error('AI service is currently overloaded. Please try again in a few minutes.');
    } else if (error.status === 429 || error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error('Failed to analyze resume. Please check your internet connection and try again.');
    }
  }
};

export const generateResumeContent = async (prompt: string): Promise<string> => {
  try {
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });
    
    return result;
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      throw new Error('AI service is currently overloaded. Please try again in a few minutes.');
    } else if (error.status === 429 || error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error('Failed to generate content. Please try again.');
    }
  }
};

export const generateResume = async (data: ResumeData): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Create a highly ATS-optimized, professional resume that will pass through Applicant Tracking Systems. Use the following guidelines:

CRITICAL ATS REQUIREMENTS:
- Use standard section headers: PROFESSIONAL SUMMARY, CORE COMPETENCIES, PROFESSIONAL EXPERIENCE, EDUCATION, KEY PROJECTS
- Include relevant keywords for the ${data.jobRole} role
- Use action verbs and quantifiable achievements
- Ensure proper formatting with consistent fonts and spacing
- Include industry-specific terminology and skills

CANDIDATE INFORMATION:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Target Role: ${data.jobRole}
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}
${data.github ? `GitHub: ${data.github}` : ''}
${data.summary ? `Summary: ${data.summary}` : ''}

SKILLS (optimize with industry keywords): 
${data.skills.join(', ')}

EDUCATION:
${data.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`).join('\n')}

PROFESSIONAL EXPERIENCE:
${data.experience.map(exp => `${exp.role} at ${exp.company} (${exp.duration})
${exp.description}`).join('\n\n')}

${data.projects.length > 0 ? `KEY PROJECTS:
${data.projects.map(proj => `${proj.name}: ${proj.description} (Technologies: ${proj.technologies})`).join('\n')}` : ''}

${data.certifications.length > 0 ? `CERTIFICATIONS: ${data.certifications.join(', ')}` : ''}
${data.languages.length > 0 ? `LANGUAGES: ${data.languages.join(', ')}` : ''}
${data.achievements.length > 0 ? `ACHIEVEMENTS: ${data.achievements.join(', ')}` : ''}

INSTRUCTIONS:
1. Create compelling professional summary with ${data.jobRole} keywords
2. Optimize skills section with industry-relevant terms
3. Rewrite experience bullets with strong action verbs and metrics
4. Ensure all content is ATS-friendly and keyword-rich
5. Focus on achievements and quantifiable results
6. Use proper formatting that ATS systems can parse
7. Include relevant technical and soft skills for ${data.jobRole}

Return the optimized resume content in a clean, professional format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating ATS-optimized resume:', error);
    throw new Error('Failed to generate ATS-optimized resume. Please check your API key and try again.');
  }
};

export const getJobSuggestions = async (resumeText: string, targetRole?: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Based on the following resume, provide personalized job recommendations and career guidance:

Resume:
${resumeText}

${targetRole ? `Target Role: ${targetRole}` : ''}

Please provide:
1. Recommended job titles and roles
2. Industries that would be a good fit
3. Skills to develop for career advancement
4. Potential career paths
5. Companies or job boards to target

Format the response with clear sections and actionable advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting job suggestions:', error);
    throw new Error('Failed to get job suggestions');
  }
};

export const generateChatResponse = async (message: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a helpful AI career assistant. Provide professional advice about resumes, job search, career development, and interview preparation. Keep responses concise and actionable.

    User message: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
};

export const generateColdEmail = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating cold email:', error);
    throw new Error('Failed to generate cold email');
  }
};
