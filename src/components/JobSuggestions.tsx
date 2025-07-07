
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ExternalLink, Briefcase, Users, DollarSign, GraduationCap, Target, TrendingUp, Globe, MapPin } from 'lucide-react';

interface Website {
  name: string;
  url: string;
  description: string;
  features: string[];
  locationType: 'international' | 'national' | 'both';
}

const internshipWebsites: Website[] = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities",
    features: ["Work from home options", "Stipend guaranteed", "Certificate provided"],
    locationType: 'national'
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
    description: "Professional network with extensive internship opportunities worldwide",
    features: ["Industry connections", "Company insights", "Professional networking"],
    locationType: 'international'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com/q-internship-jobs.html",
    description: "Global job search engine with comprehensive internship listings",
    features: ["Salary insights", "Company reviews", "Application tracking"],
    locationType: 'international'
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/internship-jobs-SRCH_KO0,10.htm",
    description: "Job search platform with company insights and internship opportunities",
    features: ["Company reviews", "Salary transparency", "Interview insights"],
    locationType: 'international'
  }
];

const freelancingWebsites: Website[] = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Global freelancing platform with diverse project opportunities",
    features: ["Payment protection", "Time tracking", "Skill tests"],
    locationType: 'international'
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Marketplace for digital services starting at $5",
    features: ["Gig-based system", "Quick turnaround", "Level progression"],
    locationType: 'international'
  },
  {
    name: "Freelancer",
    url: "https://www.freelancer.com",
    description: "Contest-based and project-based freelancing platform",
    features: ["Milestone payments", "Contest opportunities", "Mobile app"],
    locationType: 'international'
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Elite network of top 3% freelance talent",
    features: ["Rigorous screening", "Premium rates", "Direct client matching"],
    locationType: 'international'
  }
];

const jobSearchWebsites: Website[] = [
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description: "Professional networking platform with extensive job opportunities",
    features: ["AI-powered matching", "Company insights", "Professional networking"],
    locationType: 'international'
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com",
    description: "World's largest job search engine with millions of listings",
    features: ["Resume upload", "Salary insights", "Company reviews"],
    locationType: 'international'
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com",
    description: "India's leading job portal with comprehensive opportunities",
    features: ["Indian market focus", "Resume building", "Company reviews"],
    locationType: 'national'
  },
  {
    name: "Monster",
    url: "https://www.monster.com",
    description: "Global employment website for job seekers and employers",
    features: ["Career advice", "Resume services", "Job alerts"],
    locationType: 'international'
  }
];

const scholarshipWebsites: Website[] = [
  {
    name: "Study Buddy",
    url: "https://www.studybuddy.com",
    description: "Comprehensive scholarship search platform for international students",
    features: ["Personalized matching", "Application tracking", "Deadline reminders"],
    locationType: 'international'
  },
  {
    name: "Scholarships.com",
    url: "https://www.scholarships.com",
    description: "Free scholarship search engine with millions in awards",
    features: ["Free to use", "Custom matches", "Application tools"],
    locationType: 'international'
  },
  {
    name: "Fastweb",
    url: "https://www.fastweb.com",
    description: "Leading scholarship search platform with personalized results",
    features: ["Scholarship matching", "College search", "Financial aid advice"],
    locationType: 'international'
  },
  {
    name: "Scholarship Portal",
    url: "https://www.scholarshipportal.com",
    description: "European scholarship database for international students",
    features: ["European focus", "Study abroad info", "University partnerships"],
    locationType: 'international'
  },
  {
    name: "Buddy4Study",
    url: "https://www.buddy4study.com",
    description: "India's largest scholarship platform for students",
    features: ["Merit-based scholarships", "Need-based aid", "Government schemes"],
    locationType: 'national'
  },
  {
    name: "CollegeDekho Scholarships",
    url: "https://www.collegedekho.com/scholarships",
    description: "Comprehensive scholarship portal for Indian students",
    features: ["College partnerships", "Easy application", "Expert guidance"],
    locationType: 'national'
  }
];

const JobSuggestions = () => {
  const [showInternational, setShowInternational] = useState(true);

  const filterWebsites = (websites: Website[]) => {
    if (showInternational) {
      return websites.filter(website => 
        website.locationType === 'international' || website.locationType === 'both'
      );
    } else {
      return websites.filter(website => 
        website.locationType === 'national' || website.locationType === 'both'
      );
    }
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
          
          <div className="flex justify-end">
            <Badge className={`text-xs ${
              website.locationType === 'international' 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
                : website.locationType === 'national'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
            } backdrop-blur-sm`}>
              {website.locationType === 'international' ? '🌍 International' : 
               website.locationType === 'national' ? '🏠 National' : '🌐 Both'}
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
        {/* Global Location Filter Switch */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-3xl backdrop-blur-xl shadow-2xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold text-lg">Location Filter:</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium transition-colors ${!showInternational ? 'text-green-400' : 'text-gray-400'}`}>
                  🏠 National
                </span>
                <Switch
                  checked={showInternational}
                  onCheckedChange={setShowInternational}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-green-500"
                />
                <span className={`text-sm font-medium transition-colors ${showInternational ? 'text-blue-400' : 'text-gray-400'}`}>
                  🌍 International
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Job Search Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4 text-white">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              🔍 Job Search Portals
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

        {/* New Scholarship Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4 text-white">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              🎓 Scholarship Opportunities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Fund your education with scholarships from top platforms worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterWebsites(scholarshipWebsites).map((website, index) => (
              <WebsiteCard 
                key={index} 
                website={website} 
                icon={GraduationCap} 
                accentColor="bg-gradient-to-r from-yellow-500 to-orange-500"
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
      </div>
    </div>
  );
};

export default JobSuggestions;
