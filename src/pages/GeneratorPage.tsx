
import { useState } from 'react';
import ResumeGenerator from '../components/ResumeGenerator';
import { Sparkles, FileText, Zap } from 'lucide-react';

const GeneratorPage = () => {
  const [generatedResume, setGeneratedResume] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              AI Resume Generator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Create professional, ATS-optimized resumes powered by advanced AI technology. 
            Stand out from the competition with personalized, industry-specific content.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <FileText className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">ATS-Optimized</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Professional Templates</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ResumeGenerator onResumeGenerated={setGeneratedResume} />
      </div>
    </div>
  );
};

export default GeneratorPage;
