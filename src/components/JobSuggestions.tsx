
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ExternalLink, MapPin, Globe, Briefcase, Users, DollarSign, Search, Sparkles, Target, TrendingUp } from 'lucide-react';

interface Website {
  name: string;
  url: string;
  description: string;
  features: string[];
  stats: string;
  categories?: string[];
  locations?: string[];
}

const internshipWebsites = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities",
    features: ["Work from home options", "Stipend guaranteed", "Certificate provided"],
    stats: "10M+ students registered",
    categories: ["Engineering", "Business", "Design", "Marketing"],
    locations: ["National (India)", "International", "Remote"]
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
    description: "Professional network with extensive internship opportunities worldwide",
    features: ["Industry connections", "Company insights", "Professional networking"],
    stats: "900M+ members globally",
    categories: ["All Industries", "Remote Work", "Entry Level"],
    locations: ["International", "National", "Global Remote"]
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com/internship-jobs",
    description: "India's leading job portal with dedicated internship section",
    features: ["Indian market focus", "Resume building", "Company reviews"],
    stats: "70M+ registered jobseekers",
    categories: ["IT", "Finance", "Sales", "HR"],
    locations: ["National (India)", "International", "Hybrid"]
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com/q-internship-jobs.html",
    description: "Global job search engine with comprehensive internship listings",
    features: ["Salary insights", "Company reviews", "Application tracking"],
    stats: "250M+ monthly visitors",
    categories: ["Global Opportunities", "Remote", "Part-time"],
    locations: ["International", "National", "Remote Global"]
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/internship-jobs-SRCH_KO0,10.htm",
    description: "Job search platform with company insights and internship opportunities",
    features: ["Company reviews", "Salary transparency", "Interview insights"],
    stats: "59M+ monthly users",
    categories: ["Tech", "Finance", "Consulting", "Healthcare"],
    locations: ["International", "National", "Remote"]
  },
  {
    name: "AngelList (Wellfound)",
    url: "https://wellfound.com/jobs",
    description: "Startup internships and early career opportunities worldwide",
    features: ["Equity compensation", "Direct founder contact", "Remote friendly"],
    stats: "130,000+ startups",
    categories: ["Startups", "Tech", "Remote", "Equity"],
    locations: ["International", "National", "Global Remote"]
  }
];

const freelancingWebsites = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Global freelancing platform with diverse project opportunities",
    features: ["Payment protection", "Time tracking", "Skill tests"],
    stats: "18M+ freelancers worldwide",
    categories: ["Web Development", "Design", "Writing", "Marketing"],
    locations: ["International", "National", "Global Remote"]
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Marketplace for digital services starting at $5",
    features: ["Gig-based system", "Quick turnaround", "Level progression"],
    stats: "4M+ active sellers",
    categories: ["Graphics & Design", "Programming", "Video & Animation", "Music"],
    locations: ["International", "National", "Remote Global"]
  },
  {
    name: "Freelancer",
    url: "https://www.freelancer.com",
    description: "Contest-based and project-based freelancing platform",
    features: ["Milestone payments", "Contest opportunities", "Mobile app"],
    stats: "50M+ users globally",
    categories: ["Programming", "Design", "Data Entry", "Marketing"],
    locations: ["International", "National", "Global"]
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Elite network of top 3% freelance talent",
    features: ["Rigorous screening", "Premium rates", "Direct client matching"],
    stats: "Top 3% talent acceptance rate",
    categories: ["Software Development", "Design", "Finance", "Project Management"],
    locations: ["International", "Remote", "Premium Global"]
  },
  {
    name: "99designs",
    url: "https://99designs.com",
    description: "Design-focused freelancing platform with contest model",
    features: ["Design contests", "1-to-1 projects", "Design guarantee"],
    stats: "1M+ designers worldwide",
    categories: ["Logo Design", "Web Design", "Print Design", "Packaging"],
    locations: ["International", "National", "Global Remote"]
  },
  {
    name: "Guru",
    url: "https://www.guru.com",
    description: "Professional freelancing platform with work room collaboration",
    features: ["SafePay protection", "Work room tools", "Invoice management"],
    stats: "3M+ members worldwide",
    categories: ["Programming", "Design", "Writing", "Administrative"],
    locations: ["International", "National", "Remote"]
  }
];

const jobSearchWebsites = [
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description: "Professional networking platform with extensive job opportunities",
    features: ["AI-powered matching", "Company insights", "Professional networking"],
    stats: "900M+ members, 25M+ jobs",
    categories: ["All Industries", "Remote Work", "Executive Roles"],
    locations: ["International", "National", "Global Remote"]
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com",
    description: "World's largest job search engine with millions of listings",
    features: ["Resume upload", "Salary insights", "Company reviews"],
    stats: "250M+ monthly visitors",
    categories: ["Global Jobs", "Remote", "Part-time", "Full-time"],
    locations: ["International", "National", "Local", "Remote"]
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com",
    description: "Job search with company reviews and salary transparency",
    features: ["Company reviews", "Salary data", "Interview preparation"],
    stats: "59M+ monthly users",
    categories: ["Tech", "Finance", "Healthcare", "Consulting"],
    locations: ["International", "National", "Remote"]
  },
  {
    name: "Monster",
    url: "https://www.monster.com",
    description: "Global employment website for job seekers and employers",
    features: ["Career advice", "Resume services", "Job alerts"],
    stats: "6M+ job seekers monthly",
    categories: ["Entry Level", "Mid-Career", "Senior Roles"],
    locations: ["International", "National", "Regional"]
  },
  {
    name: "ZipRecruiter",
    url: "https://www.ziprecruiter.com",
    description: "AI-powered job matching platform for quick applications",
    features: ["One-click applications", "Mobile app", "Instant matching"],
    stats: "2.8M+ employers",
    categories: ["Quick Apply", "Local Jobs", "Remote Work"],
    locations: ["National (US)", "International", "Remote"]
  },
  {
    name: "CareerBuilder",
    url: "https://www.careerbuilder.com",
    description: "Comprehensive job search platform with career resources",
    features: ["Resume builder", "Career advice", "Skills assessment"],
    stats: "24M+ job seekers",
    categories: ["Corporate", "Government", "Healthcare", "Retail"],
    locations: ["National", "International", "Local"]
  }
];

const JobSuggestions = () => {
  const [jobQuery, setJobQuery] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Website[]>([]);

  const handleJobSearch = async () => {
    if (!jobQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple keyword matching for demonstration
    const allWebsites = [...jobSearchWebsites, ...internshipWebsites, ...freelancingWebsites];
    const keywords = jobQuery.toLowerCase().split(' ');
    
    const matches = allWebsites.filter(website => {
      const searchText = `${website.name} ${website.description} ${website.categories?.join(' ') || ''}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    });
    
    setMatchedJobs(matches.slice(0, 6)); // Limit to 6 results
    setIsSearching(false);
  };

  const WebsiteCard = ({ website, icon: Icon, accentColor }: { website: Website, icon: any, accentColor: string }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className={`p-2 rounded-xl ${accentColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="group-hover:text-blue-600 transition-colors">{website.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-gray-600 leading-relaxed">{website.description}</CardDescription>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Key Features
            </h4>
            <ul className="grid grid-cols-1 gap-1 text-sm text-gray-600">
              {website.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-purple-600" />
            <strong className="text-gray-800">Stats:</strong> 
            <span className="text-gray-600">{website.stats}</span>
          </div>
          
          {website.categories && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-1.5">
                {website.categories.map((category, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {website.locations && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-500" />
                Locations
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {website.locations.map((location, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Button asChild className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <span>Explore Opportunities</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto py-8 px-4">
        {/* Enhanced AI Job Matching Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl shadow-lg animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                AI Job Matching Assistant
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              🚀 Discover your perfect career match with our intelligent job search assistant. 
              Get personalized recommendations from top platforms worldwide.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto mb-8 border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Search className="w-6 h-6 text-white" />
                </div>
                Smart Job Search
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Tell us about your dream job and let AI find the perfect opportunities for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="job-query" className="block text-sm font-semibold text-gray-700">
                    🎯 Job Title or Keywords
                  </label>
                  <Input
                    id="job-query"
                    placeholder="e.g., Software Developer, Marketing Manager, Data Scientist"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="job-description" className="block text-sm font-semibold text-gray-700">
                    📝 Additional Details (Optional)
                  </label>
                  <Textarea
                    id="job-description"
                    placeholder="Describe your experience, preferred location, or specific requirements..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    className="text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                  />
                </div>
              </div>
              <Button 
                onClick={handleJobSearch} 
                disabled={isSearching || !jobQuery.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    🤖 AI is analyzing your request...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-3" />
                    ✨ Find My Perfect Job Match
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced AI Matched Results */}
          {matchedJobs.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  🎯 Perfect Matches for "{jobQuery}"
                </h3>
                <p className="text-lg text-gray-600">AI has found these amazing opportunities for you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matchedJobs.map((website, index) => (
                  <WebsiteCard 
                    key={index} 
                    website={website} 
                    icon={Briefcase} 
                    accentColor="bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Enhanced Internship Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              🎓 Internship Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Launch your career with amazing internship opportunities from top platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internshipWebsites.map((website, index) => (
              <WebsiteCard 
                key={index} 
                website={website} 
                icon={Users} 
                accentColor="bg-gradient-to-r from-blue-500 to-purple-600"
              />
            ))}
          </div>
        </section>

        {/* Enhanced Freelancing Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              💼 Freelancing Platforms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Build your independent career with global freelancing opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freelancingWebsites.map((website, index) => (
              <WebsiteCard 
                key={index} 
                website={website} 
                icon={DollarSign} 
                accentColor="bg-gradient-to-r from-green-500 to-blue-500"
              />
            ))}
          </div>
        </section>

        {/* Enhanced Job Search Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              🔍 Job Search Websites
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find your next career opportunity on these leading job search platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobSearchWebsites.map((website, index) => (
              <WebsiteCard 
                key={index} 
                website={website} 
                icon={MapPin} 
                accentColor="bg-gradient-to-r from-red-500 to-pink-500"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobSuggestions;
