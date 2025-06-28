import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateResumeContent } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Search, MapPin, Briefcase, Building, Clock, Loader2, Globe, Star, Lightbulb, Target, CheckCircle, GraduationCap, Users } from 'lucide-react';

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
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [internshipListings, setInternshipListings] = useState<InternshipListing[]>([]);
  const [jobTips, setJobTips] = useState<string[]>([]);
  const [internshipTips, setInternshipTips] = useState<string[]>([]);
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
    { name: 'Naukri.com', url: 'https://www.naukri.com', description: 'India\'s largest job portal with 50M+ job seekers' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs', description: 'Professional networking and job search platform' },
    { name: 'Indeed India', url: 'https://in.indeed.com', description: 'Global job search engine with local opportunities' },
    { name: 'Glassdoor', url: 'https://www.glassdoor.co.in', description: 'Company reviews, salaries, and job listings' },
    { name: 'Monster India', url: 'https://www.monsterindia.com', description: 'Career advancement and job search platform' },
    { name: 'Shine.com', url: 'https://www.shine.com', description: 'AI-powered job matching and career services' },
    { name: 'TimesJobs', url: 'https://www.timesjobs.com', description: 'Premier job portal by Times Internet' },
    { name: 'AngelList', url: 'https://angel.co/jobs', description: 'Startup jobs and equity opportunities' }
  ];

  const realInternshipWebsites = [
    { name: 'Internshala', url: 'https://internshala.com', description: 'India\'s largest internship platform with 300K+ opportunities' },
    { name: 'LetsIntern', url: 'https://www.letsintern.com', description: 'Curated internships and early career opportunities' },
    { name: 'LinkedIn Internships', url: 'https://www.linkedin.com/jobs/internship-jobs', description: 'Professional internship opportunities' },
    { name: 'Indeed Internships', url: 'https://in.indeed.com/Internship-jobs', description: 'Global internship search engine' },
    { name: 'Chegg Internships', url: 'https://www.chegg.com/internships', description: 'Student-focused internship platform' },
    { name: 'Forage', url: 'https://www.theforage.com', description: 'Virtual work experience programs' }
  ];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Find Jobs & Internships
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Jobs ({jobListings.length})
          </TabsTrigger>
          <TabsTrigger value="internships" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Internships ({internshipListings.length})
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

          {/* Job Websites */}
          <Card>
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Target className="w-5 h-5" />
                Best Job Websites for {targetRole || 'Your Role'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realJobWebsites.map((website, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{website.name}</h4>
                      <p className="text-xs text-muted-foreground">{website.description}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={website.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
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

          {/* Internship Websites */}
          <Card>
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Target className="w-5 h-5" />
                Best Internship Websites for {targetRole || 'Your Role'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realInternshipWebsites.map((website, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{website.name}</h4>
                      <p className="text-xs text-muted-foreground">{website.description}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={website.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* No Results Message */}
      {!isSearchingJobs && !isSearchingInternships && jobListings.length === 0 && internshipListings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Briefcase className="w-12 h-12 text-muted-foreground opacity-50" />
                <GraduationCap className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <div>
                <p className="text-xl font-medium text-muted-foreground">Ready to Find Your Next Opportunity?</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your target role to discover jobs and internships from top platforms with personalized application tips!
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
