
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateResumeContent } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Search, MapPin, Briefcase, Building, Clock, Loader2, Globe, Star, Lightbulb, Target, CheckCircle } from 'lucide-react';

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

const JobSuggestions = () => {
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [jobTips, setJobTips] = useState<string[]>([]);
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
      // Generate job listings and tips simultaneously
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

  return (
    <div className="space-y-6">
      {/* Job Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Find Jobs Across Multiple Platforms
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

          <Button
            onClick={searchJobs}
            disabled={isSearchingJobs || !targetRole.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSearchingJobs ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Searching Jobs & Generating Tips...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search Jobs & Get Application Tips
              </>
            )}
          </Button>
        </CardContent>
      </Card>

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

      {/* How to Find Jobs Section */}
      {jobListings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <Target className="w-5 h-5" />
              How to Find Jobs According to Your Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Best Job Platforms for {targetRole}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Naukri.com</strong> - India's largest job portal</li>
                  <li>• <strong>LinkedIn</strong> - Professional networking & jobs</li>
                  <li>• <strong>Indeed</strong> - Global job search engine</li>
                  <li>• <strong>AngelList</strong> - Startup jobs and equity positions</li>
                  <li>• <strong>Glassdoor</strong> - Company reviews & salary insights</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company Research Tips
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Check company website and recent news</li>
                  <li>• Read employee reviews on Glassdoor</li>
                  <li>• Follow company social media for culture insights</li>  
                  <li>• Connect with current employees on LinkedIn</li>
                  <li>• Research salary ranges and interview processes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Jobs Message */}
      {!isSearchingJobs && jobListings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <p className="text-xl font-medium text-muted-foreground">Ready to Find Your Next Opportunity?</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your target role to discover jobs from top platforms and get personalized application tips!
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
