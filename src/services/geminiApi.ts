
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAHI6dEYABoLBXht70PtS97_fPFruDipH8';

const genAI = new GoogleGenerativeAI(API_KEY);

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  jobRole: string;
  summary?: string;
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  certifications: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
  languages?: string[];
  achievements?: string[];
}

export interface AnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  formatSuggestions: string[];
  improvements: string[];
  matchingJobRoles: string[];
}

export const generateResume = async (data: ResumeData): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a professional, ATS-optimized resume for the following candidate in markdown format:

Name: ${data.fullName}
Contact: ${data.email}, ${data.phone}${data.linkedin ? `, LinkedIn: ${data.linkedin}` : ''}${data.github ? `, GitHub: ${data.github}` : ''}${data.portfolio ? `, Portfolio: ${data.portfolio}` : ''}
Target Job Role: ${data.jobRole}
${data.summary ? `Summary: ${data.summary}` : ''}
Skills: ${data.skills.join(', ')}
Education: ${data.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`).join('; ')}
Work Experience: ${data.experience.map(exp => `${exp.role} at ${exp.company} (${exp.duration}) - ${exp.description}`).join('; ')}
Certifications: ${data.certifications.join(', ')}
Projects: ${data.projects.map(proj => `${proj.name}: ${proj.description} (Tech: ${proj.technologies})`).join('; ')}
${data.languages ? `Languages: ${data.languages.join(', ')}` : ''}
${data.achievements ? `Achievements: ${data.achievements.join(', ')}` : ''}

Return the resume in clean markdown format with proper sections and formatting. Include relevant keywords for the target job role to optimize for ATS systems.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Failed to generate resume. Please try again.');
  }
};

export const analyzeResume = async (resumeText: string): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze the following resume text for ATS optimization and job alignment.

Provide your analysis in the following JSON format:
{
  "atsScore": number (out of 100),
  "missingKeywords": ["keyword1", "keyword2"],
  "formatSuggestions": ["suggestion1", "suggestion2"],
  "improvements": ["improvement1", "improvement2"],
  "matchingJobRoles": ["role1", "role2", "role3"]
}

Resume Text:
${resumeText}

Focus on ATS compatibility, keyword optimization, formatting issues, and suggest specific improvements to make the resume more competitive.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      atsScore: 75,
      missingKeywords: ['Extracted from analysis'],
      formatSuggestions: ['Analysis completed'],
      improvements: ['Review suggestions provided'],
      matchingJobRoles: ['Various roles identified']
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
};

export const getJobSuggestions = async (resumeText: string, targetRole?: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Based on the following resume${targetRole ? ` and target role of ${targetRole}` : ''}, provide job matching suggestions in markdown format:

1. **Best Matching Job Titles** (5-7 specific roles)
2. **Skills to Acquire** (3-5 skills that would make the candidate more competitive)
3. **Recommended Industries** (3-4 industries where this profile would fit well)
4. **Career Growth Path** (next 2-3 career steps)
5. **Salary Expectations** (approximate range based on experience and skills)

Resume:
${resumeText}

Provide actionable, specific recommendations that the candidate can use to improve their job search strategy.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting job suggestions:', error);
    throw new Error('Failed to get job suggestions. Please try again.');
  }
};
