
import JobSuggestions from '../components/JobSuggestions';
import { Target, Briefcase, TrendingUp, Users } from 'lucide-react';

const JobMatchPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              Job Matching
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover personalized job recommendations and career guidance. 
            Find the perfect opportunities that match your skills and experience.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Briefcase className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Matching</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Users className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Internships</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Career Guidance</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <JobSuggestions />
      </div>
    </div>
  );
};

export default JobMatchPage;
