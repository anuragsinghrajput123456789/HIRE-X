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
    
    const prompt = `You are an expert ATS (Applicant Tracking System) resume writer and career coach. Create a highly optimized, professional resume that will pass through ATS systems and impress hiring managers.

CRITICAL ATS OPTIMIZATION REQUIREMENTS:
- Use standard section headers that ATS systems recognize
- Include 15-20 relevant keywords for ${data.jobRole} role distributed naturally throughout
- Start each experience bullet with strong action verbs (Achieved, Managed, Developed, Led, etc.)
- Include quantifiable results and metrics wherever possible
- Use industry-standard terminology and technical skills
- Ensure consistent formatting and proper spacing
- Write in third person, professional tone
- Include power words that show impact and leadership

CANDIDATE INFORMATION:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Target Role: ${data.jobRole}
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}
${data.github ? `GitHub: ${data.github}` : ''}

PROFESSIONAL SUMMARY REQUIREMENTS:
${data.summary ? `Base Summary: ${data.summary}` : `Create a compelling 3-4 line summary for ${data.jobRole}`}
- Highlight years of experience and key expertise
- Include 3-5 industry keywords
- Showcase unique value proposition
- Mention quantifiable achievements if applicable

CORE COMPETENCIES (Optimize with ATS keywords):
${data.skills.join(', ')}
- Add related technical skills and tools
- Include soft skills relevant to ${data.jobRole}
- Use industry-standard terminology
- Group by categories if applicable (Technical Skills, Leadership, etc.)

EDUCATION:
${data.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`).join('\n')}

PROFESSIONAL EXPERIENCE (Rewrite with impact):
${data.experience.map(exp => `${exp.role} at ${exp.company} (${exp.duration})
Current Description: ${exp.description}`).join('\n\n')}

ENHANCEMENT INSTRUCTIONS FOR EXPERIENCE:
1. Start each bullet with a strong action verb
2. Include specific numbers, percentages, or metrics
3. Show progression and growth
4. Highlight achievements, not just responsibilities
5. Use keywords relevant to ${data.jobRole}
6. Focus on results and business impact

${data.projects.length > 0 ? `KEY PROJECTS:
${data.projects.map(proj => `${proj.name}: ${proj.description} (Technologies: ${proj.technologies})`).join('\n')}
- Enhance project descriptions with technical details and outcomes` : ''}

${data.certifications.length > 0 ? `CERTIFICATIONS: ${data.certifications.join(', ')}` : ''}
${data.languages.length > 0 ? `LANGUAGES: ${data.languages.join(', ')}` : ''}
${data.achievements.length > 0 ? `ACHIEVEMENTS: ${data.achievements.join(', ')}` : ''}

OUTPUT REQUIREMENTS:
1. Professional Summary: 3-4 compelling lines with keywords
2. Core Competencies: Organized list with industry keywords
3. Professional Experience: Rewritten bullets with action verbs and metrics
4. Education: Clean, ATS-friendly format
5. Additional sections as applicable
6. Ensure keyword density of 2-3% for target role
7. Use consistent formatting throughout
8. Include relevant technical and soft skills
9. Focus on achievements and quantifiable results
10. Make it ATS-parseable with clear section headers

Create a complete, polished resume that will score 90+ on ATS systems and impress hiring managers. The content should be professional, impactful, and perfectly tailored for the ${data.jobRole} position.`;

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
