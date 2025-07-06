
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ExternalLink, Briefcase, Users, DollarSign, Search, Sparkles, Target, TrendingUp } from 'lucide-react';

interface Website {
  name: string;
  url: string;
  description: string;
  features: string[];
  stats: string;
  locationType: 'international' | 'national' | 'both';
}

const internshipWebsites: Website[] = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities",
    features: ["Work from home options", "Stipend guaranteed", "Certificate provided"],
    stats: "10M+ students registered",
    locationType: 'national'
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
    description: "Professional network with extensive internship opportunities worldwide",
    features: ["Industry connections", "Company insights", "Professional networking"],
    stats: "900M+ members globally",
    locationType: 'international'
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com/internship-jobs",
    description: "India's leading job portal with dedicated internship section",
    features: ["Indian market focus", "Resume building", "Company reviews"],
    stats: "70M+ registered jobseekers",
    locationType: 'national'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com/q-internship-jobs.html",
    description: "Global job search engine with comprehensive internship listings",
    features: ["Salary insights", "Company reviews", "Application tracking"],
    stats: "250M+ monthly visitors",
    locationType: 'international'
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/internship-jobs-SRCH_KO0,10.htm",
    description: "Job search platform with company insights and internship opportunities",
    features: ["Company reviews", "Salary transparency", "Interview insights"],
    stats: "59M+ monthly users",
    locationType: 'international'
  },
  {
    name: "AngelList (Wellfound)",
    url: "https://wellfound.com/jobs",
    description: "Startup internships and early career opportunities worldwide",
    features: ["Equity compensation", "Direct founder contact", "Remote friendly"],
    stats: "130,000+ startups",
    locationType: 'international'
  }
];

const freelancingWebsites: Website[] = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Global freelancing platform with diverse project opportunities",
    features: ["Payment protection", "Time tracking", "Skill tests"],
    stats: "18M+ freelancers worldwide",
    locationType: 'international'
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Marketplace for digital services starting at $5",
    features: ["Gig-based system", "Quick turnaround", "Level progression"],
    stats: "4M+ active sellers",
    locationType: 'international'
  },
  {
    name: "Freelancer",
    url: "https://www.freelancer.com",
    description: "Contest-based and project-based freelancing platform",
    features: ["Milestone payments", "Contest opportunities", "Mobile app"],
    stats: "50M+ users globally",
    locationType: 'international'
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Elite network of top 3% freelance talent",
    features: ["Rigorous screening", "Premium rates", "Direct client matching"],
    stats: "Top 3% talent acceptance rate",
    locationType: 'international'
  },
  {
    name: "99designs",
    url: "https://99designs.com",
    description: "Design-focused freelancing platform with contest model",
    features: ["Design contests", "1-to-1 projects", "Design guarantee"],
    stats: "1M+ designers worldwide",
    locationType: 'international'
  },
  {
    name: "Guru",
    url: "https://www.guru.com",
    description: "Professional freelancing platform with work room collaboration",
    features: ["SafePay protection", "Work room tools", "Invoice management"],
    stats: "3M+ members worldwide",
    locationType: 'international'
  }
];

const jobSearchWebsites: Website[] = [
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description: "Professional networking platform with extensive job opportunities",
    features: ["AI-powered matching", "Company insights", "Professional networking"],
    stats: "900M+ members, 25M+ jobs",
    locationType: 'international'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com",
    description: "World's largest job search engine with millions of listings",
    features: ["Resume upload", "Salary insights", "Company reviews"],
    stats: "250M+ monthly visitors",
    locationType: 'international'
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com",
    description: "Job search with company reviews and salary transparency",
    features: ["Company reviews", "Salary data", "Interview preparation"],
    stats: "59M+ monthly users",
    locationType: 'international'
  },
  {
    name: "Monster",
    url: "https://www.monster.com",
    description: "Global employment website for job seekers and employers",
    features: ["Career advice", "Resume services", "Job alerts"],
    stats: "6M+ job seekers monthly",
    locationType: 'international'
  },
  {
    name: "ZipRecruiter",
    url: "https://www.ziprecruiter.com",
    description: "AI-powered job matching platform for quick applications",
    features: ["One-click applications", "Mobile app", "Instant matching"],
    stats: "2.8M+ employers",
    locationType: 'national'
  },
  {
    name: "CareerBuilder",
    url: "https://www.careerbuilder.com",
    description: "Comprehensive job search platform with career resources",
    features: ["Resume builder", "Career advice", "Skills assessment"],
    stats: "24M+ job seekers",
    locationType: 'national'
  }
];

const JobSuggestions = () => {
  const [jobQuery, setJobQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Website[]>([]);
  const [locationFilter, setLocationFilter] = useState<'all' | 'international' | 'national'>('all');

  const handleJobSearch = async () => {
    if (!jobQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple keyword matching for demonstration
    const allWebsites = [...jobSearchWebsites, ...internshipWebsites, ...freelancingWebsites];
    const keywords = jobQuery.toLowerCase().split(' ');
    
    let matches = allWebsites.filter(website => {
      const searchText = `${website.name} ${website.description}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    });

    // Apply location filter
    if (locationFilter !== 'all') {
      matches = matches.filter(website => 
        website.locationType === locationFilter || website.locationType === 'both'
      );
    }
    
    setMatchedJobs(matches.slice(0, 6)); // Limit to 6 results
    setIsSearching(false);
  };

  const filterWebsites = (websites: Website[]) => {
    if (locationFilter === 'all') return websites;
    return websites.filter(website => 
      website.locationType === locationFilter || website.locationType === 'both'
    );
  };

  const WebsiteCard = ({ website, icon: Icon, accentColor }: { website: Website, icon: any, accentColor: string }) => (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl shadow-xl hover:shadow-purple-500/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-white">
          <div className={`p-3 rounded-2xl ${accentColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">{website.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <CardDescription className="text-gray-300 leading-relaxed text-base">{website.description}</CardDescription>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Key Features
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-sm text-gray-300">
              {website.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
            <Target className="w-4 h-4 text-purple-400" />
            <strong className="text-white">Stats:</strong> 
            <span className="text-gray-300">{website.stats}</span>
          </div>
          
          <div className="flex justify-end">
            <Badge className={`text-xs ${
              website.locationType === 'international' 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
            } backdrop-blur-sm`}>
              {website.locationType === 'international' ? '🌍 International' : '🏠 National'}
            </Badge>
          </div>
          
          <Button asChild className="w-full mt-6 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-0 hover:scale-[1.02]">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <span>Explore Opportunities</span>
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-60 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float animate-delay-200"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float animate-delay-500"></div>
      </div>

      <div className="container mx-auto py-12 px-4 relative z-10">
        {/* Enhanced AI Job Matching Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl shadow-2xl animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-white animate-rotate" />
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                AI Job Matching Assistant
              </h2>
            </div>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
              🚀 Discover your perfect career match with our intelligent job search assistant. 
              Get personalized recommendations from top platforms worldwide.
            </p>
          </div>
          
          <Card className="max-w-5xl mx-auto mb-12 border-0 shadow-2xl bg-gradient-to-br from-gray-800/90 via-purple-900/20 to-blue-900/20 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="flex items-center justify-center gap-4 text-3xl text-white">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                Smart Job Search
              </CardTitle>
              <CardDescription className="text-xl text-gray-300 mt-4">
                Tell us about your dream job and let AI find the perfect opportunities for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="job-query" className="block text-base font-semibold text-white">
                    🎯 Job Title or Keywords
                  </label>
                  <Input
                    id="job-query"
                    placeholder="e.g., Software Developer, Marketing Manager, Data Scientist"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    className="h-14 text-lg border-2 border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="location-filter" className="block text-base font-semibold text-white">
                    🌍 Location Preference
                  </label>
                  <Select value={locationFilter} onValueChange={(value: 'all' | 'international' | 'national') => setLocationFilter(value)}>
                    <SelectTrigger className="h-14 text-lg border-2 border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm">
                      <SelectValue placeholder="Select location preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="all">🌐 All Locations</SelectItem>
                      <SelectItem value="international">🌍 International</SelectItem>
                      <SelectItem value="national">🏠 National</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={handleJobSearch} 
                disabled={isSearching || !jobQuery.trim()}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 rounded-xl border-0 hover:scale-[1.02]"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
                    🤖 AI is analyzing your request...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-4" />
                    ✨ Find My Perfect Job Match
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced AI Matched Results */}
          {matchedJobs.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-white mb-4">
                  🎯 Perfect Matches for "{jobQuery}"
                </h3>
                <p className="text-xl text-gray-300">AI has found these amazing opportunities for you</p>
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

        {/* Location Filter Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl backdrop-blur-xl shadow-2xl">
              <span className="text-white font-semibold text-lg">Filter by Location:</span>
              <Select value={locationFilter} onValueChange={(value: 'all' | 'international' | 'national') => setLocationFilter(value)}>
                <SelectTrigger className="w-48 h-12 border-2 border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="all">🌐 All Locations</SelectItem>
                  <SelectItem value="international">🌍 International</SelectItem>
                  <SelectItem value="national">🏠 National</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Enhanced Internship Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4 text-white">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              🎓 Internship Opportunities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Launch your career with amazing internship opportunities from top platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterWebsites(internshipWebsites).map((website, index) => (
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
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4 text-white">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              💼 Freelancing Platforms
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Build your independent career with global freelancing opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterWebsites(freelancingWebsites).map((website, index) => (
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
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4 text-white">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              🔍 Job Search Websites
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Find your next career opportunity on these leading job search platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterWebsites(jobSearchWebsites).map((website, index) => (
              <WebsiteCard 
                key={index} 
                website={website} 
                icon={Briefcase} 
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
