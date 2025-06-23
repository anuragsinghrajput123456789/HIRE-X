
export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  jobRole: string;
  summary?: string;
  skills: string;
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
  certifications: string;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
  languages?: string;
  achievements?: string;
}

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
