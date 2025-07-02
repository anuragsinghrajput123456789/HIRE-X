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

export interface RealTimeAnalysis {
  keywordMatchScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  readabilityScore: number;
  structureAnalysis: {
    [key: string]: boolean;
  };
  formattingIssues: string[];
}

export interface JobDescriptionAnalysis {
  requiredKeywords: string[];
  missingFromResume: string[];
  recommendedSkills: string[];
  keywordInsertions: Array<{
    keyword: string;
    suggestion: string;
    section: string;
  }>;
}

// Retry utility function with better error handling
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
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// Improved text cleaning function
const cleanResumeText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,;:()\-@]/g, '')
    .trim();
};

// Better keyword extraction from job roles
const getJobRoleKeywords = (jobRole: string): string[] => {
  const keywordMap: { [key: string]: string[] } = {
    'Software Developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'API', 'Database', 'Frontend', 'Backend', 'Agile'],
    'Data Analyst': ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Statistics', 'Data Visualization', 'Analytics', 'Reporting'],
    'Product Manager': ['Product Strategy', 'Roadmap', 'Stakeholder Management', 'Agile', 'Scrum', 'User Research', 'Analytics'],
    'Marketing Manager': ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Campaign Management'],
    'Project Manager': ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Risk Management', 'Stakeholder Management'],
    'Business Analyst': ['Requirements Analysis', 'Process Improvement', 'SQL', 'Documentation', 'Stakeholder Management'],
    'UX/UI Designer': ['User Experience', 'User Interface', 'Figma', 'Adobe', 'Prototyping', 'User Research', 'Wireframing'],
    'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure', 'Automation', 'Monitoring'],
  };
  
  return keywordMap[jobRole] || ['Leadership', 'Communication', 'Problem Solving', 'Team Work'];
};

export const analyzeResumeRealTime = async (resumeText: string, jobRole: string): Promise<RealTimeAnalysis> => {
  try {
    console.log('Starting real-time resume analysis for job role:', jobRole);
    
    const cleanedText = cleanResumeText(resumeText).substring(0, 15000);
    
    if (cleanedText.length < 100) {
      throw new Error('Resume text is too short for meaningful analysis.');
    }
    
    const expectedKeywords = getJobRoleKeywords(jobRole);
    
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Analyze this resume for the "${jobRole}" position. Provide analysis in JSON format.

Resume Text:
${cleanedText}

Target Job Role: ${jobRole}
Expected Keywords: ${expectedKeywords.join(', ')}

Analyze and return ONLY a valid JSON object with this exact structure:
{
  "keywordMatchScore": <number 0-100>,
  "foundKeywords": [list of keywords found in resume],
  "missingKeywords": [important keywords missing from resume],
  "readabilityScore": <number 0-100 based on clarity and structure>,
  "structureAnalysis": {
    "Contact Information": <true if contact info present>,
    "Professional Summary": <true if summary/objective present>,
    "Work Experience": <true if experience section present>,
    "Education": <true if education section present>,
    "Skills": <true if skills section present>,
    "Projects": <true if projects section present>
  },
  "formattingIssues": [list of formatting problems]
}

Be accurate and specific. Only include keywords that are actually relevant to the job role.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      });
      
      const response = await result.response;
      return response.text();
    });
    
    console.log('Raw real-time analysis response:', result);
    
    // Parse JSON response with better error handling
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize the response
        const analysis: RealTimeAnalysis = {
          keywordMatchScore: Math.max(0, Math.min(100, parsed.keywordMatchScore || 0)),
          foundKeywords: Array.isArray(parsed.foundKeywords) ? parsed.foundKeywords.slice(0, 15) : [],
          missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 10) : [],
          readabilityScore: Math.max(0, Math.min(100, parsed.readabilityScore || 0)),
          structureAnalysis: parsed.structureAnalysis || {},
          formattingIssues: Array.isArray(parsed.formattingIssues) ? parsed.formattingIssues.slice(0, 8) : []
        };
        
        console.log('Real-time analysis completed successfully:', analysis);
        return analysis;
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
    }
    
    // Improved fallback with job-specific analysis
    const textLower = cleanedText.toLowerCase();
    const foundKeywords = expectedKeywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    const missingKeywords = expectedKeywords.filter(keyword => 
      !textLower.includes(keyword.toLowerCase())
    );
    
    console.log('Using enhanced fallback real-time analysis response');
    return {
      keywordMatchScore: Math.round((foundKeywords.length / expectedKeywords.length) * 100),
      foundKeywords: foundKeywords,
      missingKeywords: missingKeywords,
      readabilityScore: Math.min(85, Math.max(40, cleanedText.split(' ').length > 300 ? 75 : 60)),
      structureAnalysis: {
        'Contact Information': /email|phone|contact/.test(textLower),
        'Professional Summary': /summary|objective|profile/.test(textLower),
        'Work Experience': /experience|work|employment|job/.test(textLower),
        'Education': /education|degree|university|college/.test(textLower),
        'Skills': /skills|technical|proficient/.test(textLower),
        'Projects': /project|portfolio/.test(textLower)
      },
      formattingIssues: []
    };
    
  } catch (error: any) {
    console.error('Real-time resume analysis error:', error);
    throw new Error('Failed to analyze resume in real-time. Please try again.');
  }
};

export const analyzeResume = async (resumeText: string): Promise<AnalysisResult> => {
  try {
    console.log('Starting comprehensive resume analysis with text length:', resumeText.length);
    
    const cleanedText = cleanResumeText(resumeText).substring(0, 40000);
    
    if (cleanedText.length < 200) {
      throw new Error('Resume text is too short for comprehensive analysis. Please ensure the document contains substantial content.');
    }
    
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are an expert ATS resume analyzer. Analyze this resume comprehensively and provide detailed feedback.

Resume Content:
${cleanedText}

Provide your analysis as a valid JSON object with this exact structure:
{
  "atsScore": <number 0-100>,
  "missingKeywords": [array of important missing keywords],
  "formatSuggestions": [array of formatting improvements],
  "improvements": [array of content improvements],
  "matchingJobRoles": [array of suitable job roles]
}

Analysis Guidelines:
- ATS Score: Rate 0-100 based on keyword optimization, format compatibility, and content quality
- Missing Keywords: Focus on industry-standard terms and skills
- Format Suggestions: Address ATS compatibility issues
- Improvements: Suggest content enhancements with specifics
- Job Roles: List 3-5 roles this resume best matches

Be specific and actionable in your recommendations.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 3000,
        },
      });
      
      const response = await result.response;
      return response.text();
    });
    
    console.log('Raw comprehensive analysis response:', result);
    
    // Parse and validate JSON response
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and clean the response
        const analysis: AnalysisResult = {
          atsScore: Math.max(0, Math.min(100, parsed.atsScore || 50)),
          missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 12) : [],
          formatSuggestions: Array.isArray(parsed.formatSuggestions) ? parsed.formatSuggestions.slice(0, 8) : [],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 10) : [],
          matchingJobRoles: Array.isArray(parsed.matchingJobRoles) ? parsed.matchingJobRoles.slice(0, 6) : []
        };
        
        console.log('Comprehensive analysis completed successfully:', analysis);
        return analysis;
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
    }
    
    // Enhanced fallback analysis
    const textLower = cleanedText.toLowerCase();
    const wordCount = cleanedText.split(/\s+/).length;
    const hasContactInfo = /email|phone|contact/.test(textLower);
    const hasExperience = /experience|work|employment/.test(textLower);
    const hasEducation = /education|degree|university/.test(textLower);
    const hasSkills = /skills|technical/.test(textLower);
    
    let baseScore = 30;
    if (hasContactInfo) baseScore += 15;
    if (hasExperience) baseScore += 20;
    if (hasEducation) baseScore += 10;
    if (hasSkills) baseScore += 15;
    if (wordCount > 300) baseScore += 10;
    
    console.log('Using enhanced fallback comprehensive analysis response');
    return {
      atsScore: Math.min(100, baseScore),
      missingKeywords: ['Industry-specific keywords', 'Technical skills', 'Action verbs', 'Quantifiable achievements'],
      formatSuggestions: ['Use standard section headers', 'Include contact information', 'Add quantifiable achievements', 'Optimize for ATS parsing'],
      improvements: ['Add specific metrics and numbers', 'Include more relevant keywords', 'Enhance job descriptions', 'Strengthen skills section'],
      matchingJobRoles: ['Entry Level Positions', 'Administrative Roles', 'Customer Service', 'General Business Roles']
    };
    
  } catch (error: any) {
    console.error('Comprehensive resume analysis error:', error);
    throw new Error('Failed to analyze resume comprehensively. Please try again.');
  }
};

export const analyzeJobDescription = async (resumeText: string, jobDescription: string): Promise<JobDescriptionAnalysis> => {
  try {
    console.log('Starting job description analysis...');
    
    const cleanedResume = cleanResumeText(resumeText).substring(0, 15000);
    const cleanedJobDesc = cleanResumeText(jobDescription).substring(0, 10000);
    
    if (cleanedResume.length < 100 || cleanedJobDesc.length < 100) {
      throw new Error('Both resume and job description must contain substantial content for analysis.');
    }
    
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Compare this resume against the job description and provide targeted recommendations.

Resume:
${cleanedResume}

Job Description:
${cleanedJobDesc}

Analyze the gap and provide ONLY a valid JSON object:
{
  "requiredKeywords": [8-12 key required keywords from job description],
  "missingFromResume": [keywords from job description missing in resume],
  "recommendedSkills": [6-10 additional skills to strengthen application],
  "keywordInsertions": [
    {
      "keyword": "specific keyword",
      "suggestion": "Natural sentence to incorporate this keyword",
      "section": "Experience/Skills/Summary"
    }
  ]
}

Focus on actionable, specific recommendations. Make suggestions natural and professional.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2500,
        },
      });
      
      const response = await result.response;
      return response.text();
    });
    
    console.log('Raw job description analysis response:', result);
    
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        const analysis: JobDescriptionAnalysis = {
          requiredKeywords: Array.isArray(parsed.requiredKeywords) ? parsed.requiredKeywords.slice(0, 12) : [],
          missingFromResume: Array.isArray(parsed.missingFromResume) ? parsed.missingFromResume.slice(0, 10) : [],
          recommendedSkills: Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills.slice(0, 10) : [],
          keywordInsertions: Array.isArray(parsed.keywordInsertions) ? parsed.keywordInsertions.slice(0, 8) : []
        };
        
        console.log('Job description analysis completed successfully:', analysis);
        return analysis;
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
    }
    
    // Enhanced fallback
    console.log('Using enhanced fallback job description analysis response');
    return {
      requiredKeywords: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
      missingFromResume: ['Strategic Planning', 'Data Analysis', 'Project Management'],
      recommendedSkills: ['Process Improvement', 'Cross-functional Collaboration', 'Results-oriented'],
      keywordInsertions: [
        {
          keyword: 'Strategic Planning',
          suggestion: 'Contributed to strategic planning initiatives that improved operational efficiency',
          section: 'Experience'
        }
      ]
    };
    
  } catch (error: any) {
    console.error('Job description analysis error:', error);
    throw new Error('Failed to analyze job description match. Please try again.');
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
