
import Chatbot from '../components/Chatbot';
import { MessageCircle, Bot, Sparkles, HelpCircle } from 'lucide-react';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-cyan-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              AI Career Assistant
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Get personalized career advice and resume tips from our AI assistant. 
            Available 24/7 to help you navigate your career journey.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Bot className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Personalized</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <HelpCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Chatbot />
      </div>
    </div>
  );
};

export default ChatPage;
