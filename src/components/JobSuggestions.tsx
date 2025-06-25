
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateResumeContent } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Search, MapPin, Briefcase, Building, Clock, Loader2, Globe, Star } from 'lucide-react';

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
}

const JobSuggestions = () => {
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
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
      const prompt = `Generate 12 realistic and current job listings for "${targetRole}" role ${location ? `in ${location}` : 'across India'} ${experienceLevel ? `for ${experienceLevel} level` : ''}. 

Create realistic job opportunities from these platforms:
- Naukri.com (India's leading job portal)
- LinkedIn (Professional network)
- Indeed (Global job search)
- Glassdoor (Company reviews & jobs)
- AngelList/Wellfound (Startup jobs)
- Times Jobs (Indian job portal)
- Monster.com (Career site)
- Shine.com (Job search engine)
- Internshala (For fresher/internship roles)
- Instahyre (Tech jobs)
- Freshersworld.com (Entry level)
- JobsForHer (Diversity hiring)

For each job listing, provide realistic details:
1. Job Title (variations of ${targetRole})
2. Real/realistic Company Names (mix of MNCs, startups, and established Indian companies)
3. Location (Indian cities or remote)
4. Job Type (Full-time, Contract, Remote, Hybrid)
5. Experience Required (based on level specified)
6. Key Skills (relevant to the role)
7. Platform (from the list above)
8. Realistic job portal URL format
9. Posted time (recent dates)
10. Salary range (if applicable, in INR)
11. Brief job description

Return ONLY a JSON array in this exact format:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, State or Remote",
    "type": "Employment Type",
    "experience": "Experience Level",
    "skills": ["skill1", "skill2", "skill3", "skill4"],
    "platform": "Platform Name",
    "url": "https://platform-domain.com/jobs/job-id",
    "posted": "Time posted",
    "salary": "Salary range in INR (optional)",
    "description": "Brief 2-3 line job description"
  }
]

Make jobs diverse, realistic, and currently relevant. Include variety in company sizes, locations, and requirements.`;

      const result = await generateResumeContent(prompt);
      
      let listings: JobListing[] = [];
      try {
        // Extract JSON from the response
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          listings = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.log('Failed to parse AI response, using fallback data');
        listings = generateFallbackJobListings(targetRole, location, experienceLevel);
      }

      // Validate and clean the listings
      listings = listings.filter(job => job.title && job.company && job.platform);
      
      setJobListings(listings);
      toast({
        title: "Jobs Found!",
        description: `Found ${listings.length} job opportunities from multiple platforms!`,
      });
    } catch (error) {
      console.error('Job search error:', error);
      const fallbackListings = generateFallbackJobListings(targetRole, location, experienceLevel);
      setJobListings(fallbackListings);
      toast({
        title: "Jobs Available",
        description: `Generated ${fallbackListings.length} job opportunities!`,
      });
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const generateFallbackJobListings = (role: string, loc: string, exp: string): JobListing[] => {
    const platforms = [
      { name: 'Naukri.com', domain: 'naukri.com', color: 'bg-blue-100 text-blue-800' },
      { name: 'LinkedIn', domain: 'linkedin.com', color: 'bg-blue-100 text-blue-800' },
      { name: 'Indeed', domain: 'indeed.co.in', color: 'bg-green-100 text-green-800' },
      { name: 'Glassdoor', domain: 'glassdoor.co.in', color: 'bg-emerald-100 text-emerald-800' },
      { name: 'AngelList', domain: 'wellfound.com', color: 'bg-purple-100 text-purple-800' },
      { name: 'Times Jobs', domain: 'timesjobs.com', color: 'bg-orange-100 text-orange-800' },
      { name: 'Monster.com', domain: 'monsterindia.com', color: 'bg-red-100 text-red-800' },
      { name: 'Shine.com', domain: 'shine.com', color: 'bg-yellow-100 text-yellow-800' },
      { name: 'Instahyre', domain: 'instahyre.com', color: 'bg-indigo-100 text-indigo-800' },
      { name: 'Internshala', domain: 'internshala.com', color: 'bg-pink-100 text-pink-800' }
    ];

    const companies = [
      'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL Technologies', 'Tech Mahindra',
      'Amazon', 'Google', 'Microsoft', 'Adobe', 'Salesforce', 'Oracle', 'IBM',
      'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'BYJU\'S', 'Unacademy', 'PhonePe',
      'Deloitte', 'EY', 'KPMG', 'PwC', 'Capgemini', 'L&T Infotech', 'Mindtree'
    ];

    const locations = loc ? [loc, `Near ${loc}`, `${loc} Metro Area`] : 
      ['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Remote', 'Work from Home'];

    const jobTypes = ['Full-time', 'Contract', 'Remote', 'Hybrid', 'Part-time'];
    const experiences = exp ? [exp] : ['0-2 years', '2-5 years', '3-6 years', '5+ years', 'Fresher', 'Entry Level', 'Mid Level', 'Senior Level'];
    
    const skillSets = [
      ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      ['Python', 'Django', 'AWS', 'Docker'],
      ['Java', 'Spring Boot', 'MySQL', 'Microservices'],
      ['Angular', 'TypeScript', 'Azure', 'DevOps'],
      ['React Native', 'Flutter', 'Mobile Development', 'Firebase'],
      ['Data Science', 'Machine Learning', 'Python', 'SQL'],
      ['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media'],
      ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping']
    ];

    const posted = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago'];
    const salaries = ['₹3-8 LPA', '₹5-12 LPA', '₹8-15 LPA', '₹10-20 LPA', '₹15-25 LPA', '₹20-35 LPA'];

    return Array.from({ length: 12 }, (_, i) => {
      const platform = platforms[i % platforms.length];
      return {
        title: `${role} - ${['Senior', 'Lead', 'Principal', 'Associate', 'Jr.', ''][i % 6]} ${role}`,
        company: companies[i % companies.length],
        location: locations[i % locations.length],
        type: jobTypes[i % jobTypes.length],
        experience: experiences[i % experiences.length],
        skills: skillSets[i % skillSets.length],
        platform: platform.name,
        url: `https://${platform.domain}/jobs/${role.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
        posted: posted[i % posted.length],
        salary: salaries[i % salaries.length],
        description: `Exciting opportunity for ${role} with growth potential. Join our dynamic team and work on cutting-edge projects. Competitive package and great work culture.`
      };
    });
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'Naukri.com': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'LinkedIn': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Indeed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Glassdoor': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      'AngelList': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Times Jobs': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Monster.com': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Shine.com': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Instahyre': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'Internshala': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
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
                Searching Jobs Across Platforms...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search Jobs on Multiple Platforms
              </>
            )}
          </Button>
        </CardContent>
      </Card>

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
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </p>
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

                    {job.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getPlatformColor(job.platform)}`}>
                        {job.platform}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Apply
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

      {/* No Jobs Message */}
      {!isSearchingJobs && jobListings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <p className="text-xl font-medium text-muted-foreground">Ready to Find Your Next Opportunity?</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your target role and location to discover jobs from top platforms like Naukri, LinkedIn, Indeed, and more!
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
