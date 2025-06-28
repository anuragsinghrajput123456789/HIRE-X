
import ResumeAnalyzer from '../components/ResumeAnalyzer';
import { Search, Target, TrendingUp, CheckCircle } from 'lucide-react';

const AnalyzerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-green-900/10 dark:to-blue-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              Resume Analyzer
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Get detailed analysis and improvement suggestions for your resume. 
            Boost your ATS compatibility and increase your chances of landing interviews.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ATS Score</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Improvement Tips</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Professional Analysis</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ResumeAnalyzer />
      </div>
    </div>
  );
};

export default AnalyzerPage;
