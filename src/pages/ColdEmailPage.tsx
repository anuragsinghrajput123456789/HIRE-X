
import ColdEmailGenerator from '../components/ColdEmailGenerator';
import { Mail, Send, Users, Zap } from 'lucide-react';

const ColdEmailPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-orange-900/10 dark:to-red-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              Cold Email Generator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Generate personalized cold emails and send them directly to potential employers and recruiters. 
            Make meaningful connections and land your dream job.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Generated</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Send className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Direct Send</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Personalized</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ColdEmailGenerator />
      </div>
    </div>
  );
};

export default ColdEmailPage;
