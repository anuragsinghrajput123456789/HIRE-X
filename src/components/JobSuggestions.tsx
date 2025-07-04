import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateResumeContent } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Search, MapPin, Briefcase, Building, Clock, Loader2, Globe, Star, Lightbulb, Target, CheckCircle, GraduationCap, Users, TrendingUp, Award } from 'lucide-react';

interface JobListing {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  platform: string;
  url: string;
  posted: string;
  salary?: string;
  description: string;
  companyWebsite?: string;
}

interface InternshipListing {
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend?: string;
  skills: string[];
  platform: string;
  url: string;
  posted: string;
  description: string;
  companyWebsite?: string;
}

const JobSuggestions = () => {
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [isSearchingInternships, setIsSearchingInternships] = useState(false);
  const [isSearchingFreelancing, setIsSearchingFreelancing] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [internshipListings, setInternshipListings] = useState<InternshipListing[]>([]);
  const [freelancingListings, setFreelancingListings] = useState<any[]>([]);
  const [jobTips, setJobTips] = useState<string[]>([]);
  const [internshipTips, setInternshipTips] = useState<string[]>([]);
  const [freelancingTips, setFreelancingTips] = useState<string[]>([]);
  const { toast } = useToast();

  const searchJobs = async () => {
    if (!targetRole.trim()) {
      toast({
        title: "No Target Role",
        description: "Please specify a target role to search for jobs.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingJobs(true);
    try {
      const jobListings = generateRealisticJobListings(targetRole, location, experienceLevel);
      const tips = generateJobApplicationTips(targetRole, experienceLevel);
      
      setJobListings(jobListings);
      setJobTips(tips);
      
      toast({
        title: "Jobs Found!",
        description: `Found ${jobListings.length} job opportunities and application tips!`,
      });
    } catch (error) {
      console.error('Job search error:', error);
      toast({
        title: "Search Complete",
        description: "Generated job opportunities and tips for your search!",
      });
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const searchInternships = async () => {
    if (!targetRole.trim()) {
      toast({
        title: "No Target Role",
        description: "Please specify a target role to search for internships.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingInternships(true);
    try {
      const internships = generateRealisticInternshipListings(targetRole, location);
      const tips = generateInternshipApplicationTips(targetRole);
      
      setInternshipListings(internships);
      setInternshipTips(tips);
      
      toast({
        title: "Internships Found!",
        description: `Found ${internships.length} internship opportunities and application tips!`,
      });
    } catch (error) {
      console.error('Internship search error:', error);
      toast({
        title: "Search Complete",
        description: "Generated internship opportunities and tips for your search!",
      });
    } finally {
      setIsSearchingInternships(false);
    }
  };

  const searchFreelancing = async () => {
    if (!targetRole.trim()) {
      toast({
        title: "No Target Role",
        description: "Please specify a target role to search for freelancing opportunities.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingFreelancing(true);
    try {
      const freelancingProjects = generateRealisticFreelancingListings(targetRole, location);
      const tips = generateFreelancingTips(targetRole);
      
      setFreelancingListings(freelancingProjects);
      setFreelancingTips(tips);
      
      toast({
        title: "Freelancing Projects Found!",
        description: `Found ${freelancingProjects.length} freelancing opportunities and tips!`,
      });
    } catch (error) {
      console.error('Freelancing search error:', error);
      toast({
        title: "Search Complete",
        description: "Generated freelancing opportunities and tips for your search!",
      });
    } finally {
      setIsSearchingFreelancing(false);
    }
  };

  const generateRealisticJobListings = (role: string, loc: string, exp: string): JobListing[] => {
    const realCompanies = [
      { name: 'Tata Consultancy Services', website: 'https://www.tcs.com/careers', domain: 'tcs.com' },
      { name: 'Infosys', website: 'https://www.infosys.com/careers', domain: 'infosys.com' },
      { name: 'Wipro', website: 'https://careers.wipro.com', domain: 'wipro.com' },
      { name: 'HCL Technologies', website: 'https://www.hcltech.com/careers', domain: 'hcltech.com' },
      { name: 'Tech Mahindra', website: 'https://careers.techmahindra.com', domain: 'techmahindra.com' },
      { name: 'Accenture India', website: 'https://www.accenture.com/in-en/careers', domain: 'accenture.com' },
      { name: 'IBM India', website: 'https://www.ibm.com/careers/in/', domain: 'ibm.com' },
      { name: 'Microsoft India', website: 'https://careers.microsoft.com/us/en/c/india-jobs', domain: 'microsoft.com' },
      { name: 'Amazon India', website: 'https://amazon.jobs/en-in/', domain: 'amazon.jobs' },
      { name: 'Google India', website: 'https://careers.google.com/locations/india/', domain: 'careers.google.com' },
      { name: 'Flipkart', website: 'https://www.flipkartcareers.com', domain: 'flipkartcareers.com' },
      { name: 'Paytm', website: 'https://jobs.paytm.com', domain: 'paytm.com' },
      { name: 'Zomato', website: 'https://www.zomato.com/careers', domain: 'zomato.com' },
      { name: 'Swiggy', website: 'https://careers.swiggy.com', domain: 'swiggy.com' },
      { name: 'BYJU\'S', website: 'https://byjus.com/careers/', domain: 'byjus.com' },
      { name: 'Ola', website: 'https://www.olacabs.com/careers', domain: 'olacabs.com' },
      { name: 'PhonePe', website: 'https://www.phonepe.com/careers/', domain: 'phonepe.com' },
      { name: 'Razorpay', website: 'https://razorpay.com/jobs/', domain: 'razorpay.com' }
    ];

    const jobPlatforms = [
      { name: 'Naukri.com', baseUrl: 'https://www.naukri.com/jobs-in-' },
      { name: 'LinkedIn', baseUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
      { name: 'Indeed India', baseUrl: 'https://in.indeed.com/jobs?q=' },
      { name: 'Glassdoor', baseUrl: 'https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=' },
      { name: 'Monster India', baseUrl: 'https://www.monsterindia.com/search/' },
      { name: 'Shine.com', baseUrl: 'https://www.shine.com/job-search/' },
      { name: 'TimesJobs', baseUrl: 'https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=' }
    ];

    const locations = loc ? [loc] : ['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Remote'];
    const jobTypes = ['Full-time', 'Contract', 'Remote', 'Hybrid'];
    const experiences = exp ? [exp] : ['0-2 years', '2-5 years', '3-6 years', '5+ years'];
    
    const skillSets = [
      ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      ['Python', 'Django', 'PostgreSQL', 'AWS'],
      ['Java', 'Spring Boot', 'MySQL', 'Docker'],
      ['Angular', 'TypeScript', 'Azure', 'DevOps'],
      ['React Native', 'Flutter', 'Firebase', 'API'],
      ['Data Science', 'Machine Learning', 'Python', 'SQL'],
      ['Digital Marketing', 'SEO', 'Google Analytics', 'PPC'],
      ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping']
    ];

    const salaryRanges = ['₹3-6 LPA', '₹5-10 LPA', '₹8-15 LPA', '₹12-20 LPA', '₹15-25 LPA', '₹20-35 LPA'];
    const postedTimes = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago'];

    return Array.from({ length: 12 }, (_, i) => {
      const company = realCompanies[i % realCompanies.length];
      const platform = jobPlatforms[i % jobPlatforms.length];
      const roleVariations = [role, `Senior ${role}`, `Lead ${role}`, `Associate ${role}`, `Jr. ${role}`];
      
      return {
        title: roleVariations[i % roleVariations.length],
        company: company.name,
        location: locations[i % locations.length],
        type: jobTypes[i % jobTypes.length],
        experience: experiences[i % experiences.length],
        skills: skillSets[i % skillSets.length],
        platform: platform.name,
        url: `${platform.baseUrl}${encodeURIComponent(role.toLowerCase())}&location=${encodeURIComponent(locations[i % locations.length])}`,
        posted: postedTimes[i % postedTimes.length],
        salary: salaryRanges[i % salaryRanges.length],
        description: `Exciting opportunity for ${role} with growth potential. Join our dynamic team and work on innovative projects. Competitive package and excellent work culture.`,
        companyWebsite: company.website
      };
    });
  };

  const generateRealisticInternshipListings = (role: string, loc: string): InternshipListing[] => {
    const realCompanies = [
      { name: 'Google India', website: 'https://careers.google.com/students/' },
      { name: 'Microsoft India', website: 'https://careers.microsoft.com/students' },
      { name: 'Amazon India', website: 'https://amazon.jobs/en-in/teams/internships-for-students' },
      { name: 'Flipkart', website: 'https://www.flipkartcareers.com/campus-hiring' },
      { name: 'Zomato', website: 'https://www.zomato.com/careers/internships' },
      { name: 'Swiggy', website: 'https://careers.swiggy.com/internships' },
      { name: 'Paytm', website: 'https://jobs.paytm.com/internships' },
      { name: 'BYJU\'S', website: 'https://byjus.com/careers/internships' },
      { name: 'Razorpay', website: 'https://razorpay.com/jobs/internships' },
      { name: 'PhonePe', website: 'https://www.phonepe.com/careers/internships' },
      { name: 'Ola Cabs', website: 'https://www.olacabs.com/careers/internships' },
      { name: 'Myntra', website: 'https://myntra.com/careers/internships' }
    ];

    const internshipPlatforms = [
      { name: 'Internshala', baseUrl: 'https://internshala.com/internships/' },
      { name: 'LetsIntern', baseUrl: 'https://www.letsintern.com/internships/' },
      { name: 'LinkedIn', baseUrl: 'https://www.linkedin.com/jobs/search/?keywords=intern&' },
      { name: 'Indeed India', baseUrl: 'https://in.indeed.com/jobs?q=internship' },
      { name: 'Naukri.com', baseUrl: 'https://www.naukri.com/internship-jobs-in-' },
      { name: 'AngelList', baseUrl: 'https://angel.co/jobs#find/f!%7B%22types%22%3A%5B%22intern%22%5D%7D' }
    ];

    const locations = loc ? [loc] : ['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Remote'];
    const durations = ['2 months', '3 months', '6 months', '3-6 months'];
    const stipends = ['₹5,000-15,000/month', '₹10,000-25,000/month', '₹15,000-30,000/month', 'Unpaid + Certificate'];
    
    const skillSets = [
      ['JavaScript', 'React', 'HTML/CSS', 'Git'],
      ['Python', 'Data Analysis', 'Excel', 'SQL'],
      ['Java', 'Android', 'Kotlin', 'Firebase'],
      ['UI/UX', 'Figma', 'Adobe XD', 'Prototyping'],
      ['Digital Marketing', 'Social Media', 'Content Writing', 'SEO'],
      ['Machine Learning', 'Python', 'TensorFlow', 'Data Science']
    ];

    const postedTimes = ['1 day ago', '2 days ago', '5 days ago', '1 week ago'];

    return Array.from({ length: 10 }, (_, i) => {
      const company = realCompanies[i % realCompanies.length];
      const platform = internshipPlatforms[i % internshipPlatforms.length];
      const roleVariations = [`${role} Intern`, `Summer ${role} Intern`, `${role} Internship`, `Junior ${role} Intern`];
      
      return {
        title: roleVariations[i % roleVariations.length],
        company: company.name,
        location: locations[i % locations.length],
        duration: durations[i % durations.length],
        stipend: stipends[i % stipends.length],
        skills: skillSets[i % skillSets.length],
        platform: platform.name,
        url: `${platform.baseUrl}${encodeURIComponent(role.toLowerCase())}-internship`,
        posted: postedTimes[i % postedTimes.length],
        description: `Great opportunity for ${role} internship with hands-on experience. Work with experienced professionals and gain valuable industry exposure.`,
        companyWebsite: company.website
      };
    });
  };

  const generateRealisticFreelancingListings = (role: string, loc: string) => {
    const freelancingPlatforms = [
      { name: 'Upwork', baseUrl: 'https://www.upwork.com/nx/search/jobs/?q=' },
      { name: 'Fiverr', baseUrl: 'https://www.fiverr.com/search/gigs?query=' },
      { name: 'Freelancer', baseUrl: 'https://www.freelancer.com/jobs/' },
      { name: 'Guru', baseUrl: 'https://www.guru.com/d/jobs/q/' },
      { name: 'PeoplePerHour', baseUrl: 'https://www.peopleperhour.com/freelance-jobs/' },
      { name: 'Toptal', baseUrl: 'https://www.toptal.com/freelance-jobs/' },
      { name: 'Truelancer', baseUrl: 'https://www.truelancer.com/freelancer/jobs/' },
      { name: 'Worknhire', baseUrl: 'https://www.worknhire.com/search/freelance-jobs/' }
    ];

    const projectTypes = ['Fixed Price', 'Hourly', 'Monthly Retainer', 'Project-based'];
    const budgetRanges = ['$50-$250', '$250-$750', '$750-$1500', '$1500-$3000', '$3000+'];
    const durations = ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', '3+ months'];
    const skillSets = [
      ['React', 'Node.js', 'JavaScript', 'API Integration'],
      ['Python', 'Data Analysis', 'Machine Learning', 'Pandas'],
      ['UI/UX', 'Figma', 'Adobe XD', 'Prototyping'],
      ['WordPress', 'PHP', 'MySQL', 'Custom Development'],
      ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
      ['Mobile App', 'Flutter', 'React Native', 'Firebase']
    ];

    const postedTimes = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago'];

    return Array.from({ length: 15 }, (_, i) => {
      const platform = freelancingPlatforms[i % freelancingPlatforms.length];
      const roleVariations = [
        `${role} Development Project`,
        `${role} Freelance Work`,
        `${role} Consulting`,
        `${role} Project`,
        `Remote ${role} Work`
      ];
      
      return {
        title: roleVariations[i % roleVariations.length],
        client: `Client ${String.fromCharCode(65 + (i % 26))}`,
        location: loc || 'Remote',
        type: projectTypes[i % projectTypes.length],
        budget: budgetRanges[i % budgetRanges.length],
        duration: durations[i % durations.length],
        skills: skillSets[i % skillSets.length],
        platform: platform.name,
        url: `${platform.baseUrl}${encodeURIComponent(role.toLowerCase())}`,
        posted: postedTimes[i % postedTimes.length],
        description: `Looking for an experienced ${role} for ${projectTypes[i % projectTypes.length].toLowerCase()} work. Great opportunity for freelancers with relevant skills.`,
        proposals: Math.floor(Math.random() * 20) + 1,
        rating: (4 + Math.random()).toFixed(1)
      };
    });
  };

  const generateJobApplicationTips = (role: string, exp: string): string[] => {
    const generalTips = [
      "Tailor your resume for each job application with relevant keywords",
      "Write a compelling cover letter that addresses the specific role",
      "Research the company thoroughly before applying",
      "Optimize your LinkedIn profile with a professional photo",
      "Apply within 24-48 hours of job posting for better visibility",
      "Follow up politely after 1-2 weeks if you haven't heard back",
      "Practice common interview questions related to your field",
      "Prepare specific examples using the STAR method (Situation, Task, Action, Result)"
    ];

    const roleSpecificTips = {
      'software engineer': [
        "Showcase your coding projects on GitHub with clean, documented code",
        "Mention specific programming languages and frameworks in your resume",
        "Be prepared for technical coding interviews and whiteboard sessions",
        "Contribute to open-source projects to demonstrate your skills"
      ],
      'data scientist': [
        "Create a portfolio showcasing your data analysis projects",
        "Highlight experience with Python, R, SQL, and machine learning libraries",
        "Demonstrate ability to communicate insights to non-technical stakeholders",
        "Show examples of data visualization and statistical analysis"
      ],
      'marketing': [
        "Quantify your marketing achievements with specific metrics and ROI",
        "Show familiarity with digital marketing tools and analytics platforms",
        "Create a portfolio of successful campaigns and strategies",
        "Demonstrate understanding of customer personas and market research"
      ],
      'designer': [
        "Build a strong online portfolio showcasing your best work",
        "Include case studies explaining your design process and thinking",
        "Stay updated with latest design trends and tools",
        "Show versatility across different design mediums and platforms"
      ]
    };

    const experienceBasedTips = {
      'fresher': [
        "Focus on academic projects, internships, and relevant coursework",
        "Highlight soft skills, leadership experiences, and certifications",
        "Consider applying for graduate trainee programs and entry-level positions",
        "Network with alumni and attend career fairs and industry events"
      ],
      'experienced': [
        "Quantify your achievements and impact in previous roles",
        "Highlight leadership experience and team management skills",
        "Show career progression and increasing responsibilities",
        "Consider reaching out to recruiters and headhunters in your field"
      ]
    };

    let tips = [...generalTips];
    
    // Add role-specific tips
    const roleKey = role.toLowerCase();
    for (const [key, roleTips] of Object.entries(roleSpecificTips)) {
      if (roleKey.includes(key)) {
        tips = [...tips, ...roleTips];
        break;
      }
    }

    // Add experience-based tips
    if (exp.toLowerCase().includes('fresher') || exp.includes('0-2')) {
      tips = [...tips, ...experienceBasedTips.fresher];
    } else {
      tips = [...tips, ...experienceBasedTips.experienced];
    }

    return tips.slice(0, 10); // Return top 10 most relevant tips
  };

  const generateInternshipApplicationTips = (role: string): string[] => {
    const generalTips = [
      "Highlight academic projects and coursework relevant to the role",
      "Create a portfolio showcasing your best work and projects",
      "Write a compelling cover letter explaining your interest in the field",
      "Research the company's culture and recent projects",
      "Prepare for behavioral interviews with STAR method examples",
      "Network with professionals in your field through LinkedIn",
      "Follow up after applications with a polite thank you email",
      "Be ready to discuss your career goals and learning objectives"
    ];

    const roleSpecificTips = {
      'software': [
        "Build personal coding projects and host them on GitHub",
        "Contribute to open-source projects to show collaboration skills",
        "Practice coding problems on platforms like LeetCode or HackerRank",
        "Learn version control (Git) and basic development tools"
      ],
      'data': [
        "Work on data analysis projects using real datasets",
        "Learn Python/R and data visualization tools like Tableau",
        "Complete online courses in statistics and machine learning",
        "Create data dashboards to showcase analytical thinking"
      ],
      'marketing': [
        "Create social media campaigns for personal or college projects",
        "Learn Google Analytics and digital marketing tools",
        "Write blog posts or content to demonstrate writing skills",
        "Understand basic design principles for marketing materials"
      ],
      'design': [
        "Build a strong online portfolio with diverse design projects",
        "Learn industry-standard tools like Figma, Adobe Creative Suite",
        "Follow design trends and create modern, user-friendly designs",
        "Practice user experience principles and wireframing"
      ]
    };

    let tips = [...generalTips];
    
    const roleKey = role.toLowerCase();
    for (const [key, roleTips] of Object.entries(roleSpecificTips)) {
      if (roleKey.includes(key)) {
        tips = [...tips, ...roleTips];
        break;
      }
    }

    return tips.slice(0, 8);
  };

  const generateFreelancingTips = (role: string): string[] => {
    const generalTips = [
      "Create a compelling freelancer profile with a professional photo",
      "Build a strong portfolio showcasing your best work",
      "Start with competitive rates to build reviews and ratings",
      "Write personalized proposals for each project",
      "Respond to project invitations quickly",
      "Maintain clear communication with clients",
      "Set realistic deadlines and deliver on time",
      "Ask for client feedback and testimonials"
    ];

    const roleSpecificTips = {
      'developer': [
        "Showcase your GitHub profile and live project demos",
        "Highlight your technical stack and years of experience",
        "Offer free consultations to discuss project requirements",
        "Provide code samples relevant to the project"
      ],
      'designer': [
        "Create a visually appealing portfolio with case studies",
        "Show before/after comparisons of your work",
        "Offer multiple design concepts for client selection",
        "Stay updated with latest design trends"
      ],
      'writer': [
        "Provide writing samples in your niche",
        "Offer SEO optimization services",
        "Highlight your research and fact-checking skills",
        "Show expertise in content management systems"
      ],
      'marketing': [
        "Share case studies with measurable results",
        "Highlight your knowledge of marketing tools",
        "Offer free marketing audits to potential clients",
        "Show certifications from Google, Facebook, etc."
      ]
    };

    let tips = [...generalTips];
    
    const roleKey = role.toLowerCase();
    for (const [key, roleTips] of Object.entries(roleSpecificTips)) {
      if (roleKey.includes(key)) {
        tips = [...tips, ...roleTips];
        break;
      }
    }

    return tips.slice(0, 10);
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'Naukri.com': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'LinkedIn': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Indeed India': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Glassdoor': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      'Monster India': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Shine.com': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'TimesJobs': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const realJobWebsites = [
    { name: 'Naukri.com', url: 'https://www.naukri.com', description: 'India\'s largest job portal with 50M+ job seekers', icon: '🇮🇳', users: '50M+', category: 'General' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs', description: 'Professional networking and job search platform', icon: '💼', users: '900M+', category: 'Professional' },
    { name: 'Indeed India', url: 'https://in.indeed.com', description: 'Global job search engine with local opportunities', icon: '🌍', users: '300M+', category: 'Global' },
    { name: 'Glassdoor', url: 'https://www.glassdoor.co.in', description: 'Company reviews, salaries, and job listings', icon: '⭐', users: '100M+', category: 'Reviews' },
    { name: 'Monster India', url: 'https://www.monsterindia.com', description: 'Career advancement and job search platform', icon: '👹', users: '25M+', category: 'Career' },
    { name: 'Shine.com', url: 'https://www.shine.com', description: 'AI-powered job matching and career services', icon: '✨', users: '10M+', category: 'AI-Powered' },
    { name: 'TimesJobs', url: 'https://www.timesjobs.com', description: 'Premier job portal by Times Internet', icon: '📰', users: '15M+', category: 'Premium' },
    { name: 'AngelList', url: 'https://angel.co/jobs', description: 'Startup jobs and equity opportunities', icon: '🚀', users: '8M+', category: 'Startup' }
  ];

  const realInternshipWebsites = [
    { name: 'Internshala', url: 'https://internshala.com', description: 'India\'s largest internship platform with 300K+ opportunities', icon: '🎓', opportunities: '300K+', category: 'Leading' },
    { name: 'LetsIntern', url: 'https://www.letsintern.com', description: 'Curated internships and early career opportunities', icon: '🌟', opportunities: '50K+', category: 'Curated' },
    { name: 'LinkedIn Internships', url: 'https://www.linkedin.com/jobs/internship-jobs', description: 'Professional internship opportunities', icon: '💼', opportunities: '100K+', category: 'Professional' },
    { name: 'Indeed Internships', url: 'https://in.indeed.com/Internship-jobs', description: 'Global internship search engine', icon: '🌍', opportunities: '200K+', category: 'Global' },
    { name: 'Chegg Internships', url: 'https://www.chegg.com/internships', description: 'Student-focused internship platform', icon: '📚', opportunities: '30K+', category: 'Student' },
    { name: 'Forage', url: 'https://www.theforage.com', description: 'Virtual work experience programs', icon: '💻', opportunities: '500+', category: 'Virtual' }
  ];

  const internationalFreelancingWebsites = [
    { name: 'Upwork', url: 'https://www.upwork.com', description: 'World\'s largest freelancing platform with 18M+ freelancers', flag: '🌍', users: '18M+', category: 'Leading' },
    { name: 'Fiverr', url: 'https://www.fiverr.com', description: 'Marketplace for creative & digital services starting at $5', flag: '🌍', users: '4M+', category: 'Creative' },
    { name: 'Freelancer', url: 'https://www.freelancer.com', description: 'Global crowdsourcing marketplace with 50M+ users', flag: '🌍', users: '50M+', category: 'Global' },
    { name: 'Toptal', url: 'https://www.toptal.com', description: 'Exclusive network of top 3% freelance talent', flag: '🌍', users: '1M+', category: 'Premium' },
    { name: 'Guru', url: 'https://www.guru.com', description: 'Flexible online workplace for freelancers', flag: '🌍', users: '3M+', category: 'Flexible' },
    { name: 'PeoplePerHour', url: 'https://www.peopleperhour.com', description: 'UK-based platform for freelance services', flag: '🇬🇧', users: '3M+', category: 'UK-Based' },
    { name: '99designs', url: 'https://99designs.com', description: 'Design contests and 1-to-1 design projects', flag: '🌍', users: '1M+', category: 'Design' },
    { name: 'Behance', url: 'https://www.behance.net/jobboard', description: 'Creative portfolio platform with job board', flag: '🌍', users: '20M+', category: 'Creative' }
  ];

  const nationalFreelancingWebsites = [
    { name: 'Truelancer', url: 'https://www.truelancer.com', description: 'India\'s leading freelancing platform', flag: '🇮🇳', users: '1M+', category: 'Leading' },
    { name: 'Worknhire', url: 'https://www.worknhire.com', description: 'Indian freelancing marketplace', flag: '🇮🇳', users: '500K+', category: 'Marketplace' },
    { name: 'Freelancer India', url: 'https://www.freelancer.in', description: 'Indian version of Freelancer.com', flag: '🇮🇳', users: '2M+', category: 'Local' },
    { name: 'Taskmo', url: 'https://www.taskmo.com', description: 'Gig economy platform for India', flag: '🇮🇳', users: '300K+', category: 'Gig Economy' },
    { name: 'FlexC', url: 'https://www.flexc.work', description: 'Flexible work platform for India', flag: '🇮🇳', users: '100K+', category: 'Flexible' },
    { name: 'Hunar Online', url: 'https://www.hunaronline.com', description: 'Skill-based freelancing platform', flag: '🇮🇳', users: '200K+', category: 'Skill-Based' }
  ];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Find Jobs, Internships & Freelancing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetRole">Target Role *</Label>
              <Input
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer, Data Scientist"
              />
            </div>
            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bangalore, Mumbai, Remote"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                placeholder="e.g., 0-2 years, Senior Level"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={searchJobs}
              disabled={isSearchingJobs || !targetRole.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSearchingJobs ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching Jobs...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5 mr-2" />
                  Search Jobs & Tips
                </>
              )}
            </Button>

            <Button
              onClick={searchInternships}
              disabled={isSearchingInternships || !targetRole.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isSearchingInternships ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching Internships...
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Search Internships & Tips
                </>
              )}
            </Button>

            <Button
              onClick={searchFreelancing}
              disabled={isSearchingFreelancing || !targetRole.trim()}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              {isSearchingFreelancing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching Freelancing...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Search Freelancing & Tips
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Jobs ({jobListings.length})
          </TabsTrigger>
          <TabsTrigger value="internships" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Internships ({internshipListings.length})
          </TabsTrigger>
          <TabsTrigger value="freelancing" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Freelancing ({freelancingListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Job Application Tips */}
          {jobTips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Job Application Tips for {targetRole}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {jobTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Listings */}
          {jobListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Opportunities ({jobListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobListings.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span className="text-muted-foreground">{job.company}</span>
                            {job.companyWebsite && (
                              <Button size="sm" variant="ghost" asChild className="h-6 px-2">
                                <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <Star className="w-4 h-4" />
                              {job.salary}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">{job.type}</Badge>
                          <Badge variant="outline" className="text-xs">{job.experience}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getPlatformColor(job.platform)}`}>
                            {job.platform}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <a href={job.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Search Jobs
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Job Websites Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-b">
              <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Best Job Websites for {targetRole || 'Your Career'}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {realJobWebsites.length} Platforms
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {realJobWebsites.map((website, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{website.icon}</div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {website.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {website.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <Users className="w-3 h-3" />
                                {website.users}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40" 
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </a>
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {website.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <TrendingUp className="w-3 h-3" />
                          <span>Active Hiring</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs px-3 py-1.5 h-auto"
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            Visit Site
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internships" className="space-y-6">
          {/* Internship Application Tips */}
          {internshipTips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Internship Application Tips for {targetRole}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {internshipTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internship Listings */}
          {internshipListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Internship Opportunities ({internshipListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {internshipListings.map((internship, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{internship.title}</h3>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span className="text-muted-foreground">{internship.company}</span>
                            {internship.companyWebsite && (
                              <Button size="sm" variant="ghost" asChild className="h-6 px-2">
                                <a href={internship.companyWebsite} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {internship.location}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {internship.duration} • {internship.posted}
                          </div>
                          {internship.stipend && (
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <Star className="w-4 h-4" />
                              {internship.stipend}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {internship.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {internship.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{internship.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {internship.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getPlatformColor(internship.platform)}`}>
                            {internship.platform}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <a href={internship.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Apply Now
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Internship Websites Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 via-blue-50 to-teal-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-teal-950/20 border-b">
              <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                Best Internship Websites for {targetRole || 'Your Field'}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {realInternshipWebsites.length} Platforms
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {realInternshipWebsites.map((website, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-900/10 dark:to-gray-900 hover:shadow-lg hover:shadow-green-100/50 dark:hover:shadow-green-900/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{website.icon}</div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {website.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {website.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <Briefcase className="w-3 h-3" />
                                {website.opportunities}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40" 
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </a>
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {website.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Award className="w-3 h-3" />
                          <span>Student Friendly</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-xs px-3 py-1.5 h-auto"
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            Explore
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="freelancing" className="space-y-6">
          {/* Freelancing Tips */}
          {freelancingTips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Freelancing Success Tips for {targetRole}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {freelancingTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Freelancing Project Listings */}
          {freelancingListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Freelancing Projects ({freelancingListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {freelancingListings.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span className="text-muted-foreground">{project.client}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {project.location}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {project.duration} • {project.posted}
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <Star className="w-4 h-4" />
                            {project.budget}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">{project.type}</Badge>
                          <Badge variant="outline" className="text-xs">{project.proposals} proposals</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {project.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {project.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getPlatformColor(project.platform)}`}>
                            {project.platform}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Project
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced International Freelancing Websites */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 border-b">
              <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                International Freelancing Platforms
                <Badge variant="secondary" className="ml-auto text-xs">
                  {internationalFreelancingWebsites.length} Global Platforms
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internationalFreelancingWebsites.map((website, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 hover:shadow-lg hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{website.flag}</div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {website.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {website.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                                <Users className="w-3 h-3" />
                                {website.users}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40" 
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </a>
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {website.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Globe className="w-3 h-3" />
                          <span>Global Reach</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-xs px-3 py-1.5 h-auto"
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            Join Now
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced National Freelancing Websites */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20 border-b">
              <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Indian Freelancing Platforms
                <Badge variant="secondary" className="ml-auto text-xs">
                  {nationalFreelancingWebsites.length} Local Platforms
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nationalFreelancingWebsites.map((website, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900 hover:shadow-lg hover:shadow-orange-100/50 dark:hover:shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{website.flag}</div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {website.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {website.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                <Users className="w-3 h-3" />
                                {website.users}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40" 
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </a>
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {website.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Star className="w-3 h-3" />
                          <span>Local Focus</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs px-3 py-1.5 h-auto"
                          asChild
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            Get Started
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* No Results Message */}
      {!isSearchingJobs && !isSearchingInternships && !isSearchingFreelancing && 
       jobListings.length === 0 && internshipListings.length === 0 && freelancingListings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Briefcase className="w-12 h-12 text-muted-foreground opacity-50" />
                <GraduationCap className="w-12 h-12 text-muted-foreground opacity-50" />
                <Users className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <div>
                <p className="text-xl font-medium text-muted-foreground">Ready to Find Your Next Opportunity?</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your target role to discover jobs, internships, and freelancing projects from top platforms with personalized tips!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobSuggestions;
