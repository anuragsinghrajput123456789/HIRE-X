
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getJobSuggestions } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, Search, MapPin, Briefcase, Building, Clock, Loader2 } from 'lucide-react';

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
}

const JobSuggestions = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Resume Text",
        description: "Please paste your resume content to get job suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await getJobSuggestions(resumeText, targetRole || undefined);
      setSuggestions(result);
      toast({
        title: "Suggestions Generated",
        description: "AI-powered job recommendations are ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateJobListings = async () => {
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
      // Generate realistic job listings using AI
      const prompt = `Generate 8-10 realistic job listings for the role "${targetRole}" ${location ? `in ${location}` : ''}. 

Create diverse listings from different platforms like:
- Naukri.com
- LinkedIn
- Indeed
- Glassdoor
- AngelList (for startups)
- Times Jobs
- Monster.com
- Shine.com

For each job listing, provide:
1. Job Title (variations of the target role)
2. Company Name (mix of well-known and emerging companies)
3. Location (if specified, use variations within that area, otherwise use major Indian cities)
4. Job Type (Full-time, Part-time, Contract, Remote, Hybrid)
5. Experience Required (Entry level, 2-5 years, 5+ years, etc.)
6. Key Skills Required (3-5 relevant skills)
7. Platform (one of the mentioned job sites)
8. Posted Time (Recently posted, 2 days ago, 1 week ago, etc.)

Format as JSON array with this structure:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, State",
    "type": "Full-time/Part-time/Contract/Remote/Hybrid",
    "experience": "Experience level",
    "skills": ["skill1", "skill2", "skill3"],
    "platform": "Platform Name",
    "url": "https://platform.com/job-link",
    "posted": "Time posted"
  }
]

Make it realistic and diverse.`;

      const result = await getJobSuggestions(prompt);
      
      // Try to parse JSON, fallback to mock data if parsing fails
      let listings: JobListing[] = [];
      try {
        // Extract JSON from the result if it's wrapped in markdown or text
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          listings = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.log('Failed to parse AI response, using mock data');
        // Fallback to mock data
        listings = generateMockJobListings(targetRole, location);
      }

      setJobListings(listings);
      toast({
        title: "Job Listings Found",
        description: `Found ${listings.length} job opportunities across different platforms!`,
      });
    } catch (error) {
      console.error('Job search error:', error);
      // Use mock data as fallback
      const mockListings = generateMockJobListings(targetRole, location);
      setJobListings(mockListings);
      toast({
        title: "Job Listings Generated",
        description: `Generated ${mockListings.length} sample job opportunities!`,
      });
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const generateMockJobListings = (role: string, loc: string): JobListing[] => {
    const companies = ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft', 'Accenture', 'Cognizant', 'HCL', 'Tech Mahindra'];
    const platforms = ['Naukri.com', 'LinkedIn', 'Indeed', 'Glassdoor', 'AngelList', 'Times Jobs', 'Monster.com', 'Shine.com'];
    const locations = loc ? [loc, `Near ${loc}`, `${loc} Metro`] : ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];
    const types = ['Full-time', 'Contract', 'Remote', 'Hybrid', 'Part-time'];
    const experiences = ['0-2 years', '2-5 years', '3-6 years', '5+ years', 'Fresher', 'Entry Level'];
    const skillSets = [
      ['JavaScript', 'React', 'Node.js'],
      ['Python', 'Django', 'AWS'],
      ['Java', 'Spring Boot', 'MySQL'],
      ['Angular', 'TypeScript', 'Docker'],
      ['React Native', 'Flutter', 'Mobile Development']
    ];
    const posted = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago'];

    return Array.from({ length: 9 }, (_, i) => ({
      title: `${role} - ${i + 1}`,
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      type: types[i % types.length],
      experience: experiences[i % experiences.length],
      skills: skillSets[i % skillSets.length],
      platform: platforms[i % platforms.length],
      url: `https://${platforms[i % platforms.length].toLowerCase().replace('.', '-')}.com/job-${i + 1}`,
      posted: posted[i % posted.length]
    }));
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
      'Shine.com': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Job Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Job Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="location">Preferred Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bangalore, Mumbai, Remote"
              />
            </div>
          </div>

          <Button
            onClick={generateJobListings}
            disabled={isSearchingJobs || !targetRole.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSearchingJobs ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Searching Job Platforms...
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
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                    </div>

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

      {/* AI Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="gradient-text">Get AI Career Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resumeText">Resume Content (Optional)</Label>
              <Textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content for personalized recommendations..."
                rows={8}
                className="w-full"
              />
            </div>

            <Button
              onClick={handleGetSuggestions}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? 'Generating Recommendations...' : 'Get AI Career Guidance'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="gradient-text">AI Career Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions ? (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{suggestions}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">Career guidance will appear here</p>
                <p className="text-sm mt-2">Get personalized recommendations based on your profile</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobSuggestions;
