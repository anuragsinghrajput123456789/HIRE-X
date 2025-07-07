
import JobSuggestions from '../components/JobSuggestions';
import { Target, Briefcase, TrendingUp, Users, Sparkles, Zap, Globe, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';

const JobMatchPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float animate-delay-200"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float animate-delay-500"></div>
      </div>

      <div className="container mx-auto mobile-padding py-8 lg:py-16 relative z-10">
        {/* Enhanced Header Section */}
        <div className={`text-center mb-16 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-600 rounded-3xl shadow-2xl animate-pulse-glow">
              <Target className="w-10 h-10 md:w-12 md:h-12 text-white animate-rotate" />
            </div>
            <h1 className="mobile-title font-bold gradient-text animate-gradient">
              Job Portals Hub
            </h1>
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl animate-bounce-in animate-delay-300">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            🚀 Discover your dream career with job portals, internship opportunities, 
            scholarships, and freelancing projects from around the globe
          </p>
          
          {/* Enhanced Feature Highlights */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 ${isLoaded ? 'animate-slide-in-up animate-delay-200' : 'opacity-0'}`}>
            <div className="flex flex-col items-center gap-3 card-enhanced p-6 group hover:scale-105 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl group-hover:animate-bounce">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 block">Job Portals</span>
                <span className="text-sm text-muted-foreground">Career Opportunities</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3 card-enhanced p-6 group hover:scale-105 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl group-hover:animate-bounce animate-delay-100">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 block">Internships</span>
                <span className="text-sm text-muted-foreground">Career Building</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3 card-enhanced p-6 group hover:scale-105 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl group-hover:animate-bounce animate-delay-200">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 block">Scholarships</span>
                <span className="text-sm text-muted-foreground">Education Funding</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3 card-enhanced p-6 group hover:scale-105 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl group-hover:animate-bounce animate-delay-300">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 block">Freelancing</span>
                <span className="text-sm text-muted-foreground">Global Opportunities</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={`flex justify-center ${isLoaded ? 'animate-slide-in-up animate-delay-300' : 'opacity-0'}`}>
            <button className="btn-gradient flex items-center gap-3 text-base lg:text-lg">
              <Zap className="w-5 h-5" />
              Explore Opportunities
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${isLoaded ? 'animate-slide-in-up animate-delay-500' : 'opacity-0'}`}>
          <JobSuggestions />
        </div>
      </div>
    </div>
  );
};

export default JobMatchPage;
