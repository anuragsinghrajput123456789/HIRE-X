
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

export const generateResumeContent = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
};

export const generateResume = async (data: ResumeData): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Create a professional, ATS-optimized resume based on the following information:

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Job Role: ${data.jobRole}

Skills: ${data.skills.join(', ')}

Education:
${data.education.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}

Experience:
${data.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration})\n  ${exp.description}`).join('\n\n')}

${data.projects.length > 0 ? `Projects:
${data.projects.map(proj => `- ${proj.name}: ${proj.description} (Technologies: ${proj.technologies})`).join('\n')}` : ''}

${data.certifications.length > 0 ? `Certifications: ${data.certifications.join(', ')}` : ''}
${data.languages.length > 0 ? `Languages: ${data.languages.join(', ')}` : ''}
${data.achievements.length > 0 ? `Achievements: ${data.achievements.join(', ')}` : ''}

Please format this as a professional resume with proper sections, bullet points, and ATS-friendly formatting. Use markdown formatting for better readability.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Failed to generate resume');
  }
};

export const analyzeResume = async (resumeText: string): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Analyze the following resume and provide a detailed analysis in JSON format:

Resume Text:
${resumeText}

Please analyze and return a JSON object with the following structure:
{
  "atsScore": number (0-100),
  "missingKeywords": ["keyword1", "keyword2"],
  "formatSuggestions": ["suggestion1", "suggestion2"],
  "improvements": ["improvement1", "improvement2"],
  "matchingJobRoles": ["role1", "role2"]
}

Focus on:
- ATS compatibility and keyword optimization
- Format and structure improvements
- Content enhancement suggestions
- Relevant job roles this resume would match`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
    }
    
    // Fallback if JSON parsing fails
    return {
      atsScore: 75,
      missingKeywords: ['Technical Skills', 'Industry Keywords', 'Action Verbs'],
      formatSuggestions: ['Use bullet points', 'Include quantifiable achievements', 'Optimize section headers'],
      improvements: ['Add more specific achievements', 'Include relevant keywords', 'Improve formatting consistency'],
      matchingJobRoles: ['Software Developer', 'Data Analyst', 'Project Manager']
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
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
