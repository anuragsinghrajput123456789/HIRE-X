
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🚀 **Welcome to your comprehensive AI Career Assistant!**\n\nI'm your dedicated career expert, ready to provide personalized guidance across all aspects of your professional journey:\n\n✨ **Resume & Cover Letter Optimization**\n🎯 **Interview Strategies & Mock Practice**\n🔍 **Job Search Tactics & Market Insights**\n💼 **Career Planning & Transition Guidance**\n💰 **Salary Negotiation & Benefits Analysis**\n📈 **Professional Development & Skill Building**\n🤝 **Networking Strategies & Personal Branding**\n🏢 **Industry Trends & Company Research**\n\n**What specific career challenge would you like to tackle today? I'm here to provide actionable, personalized advice!**",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI('AIzaSyAHI6dEYABoLBXht70PtS97_fPFruDipH8');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert resume and career advisor AI assistant. The user is asking: "${inputMessage}"

Please provide helpful, actionable advice related to:
- Resume writing and optimization
- Job search strategies
- Interview preparation
- Career development
- ATS (Applicant Tracking System) best practices

Keep your response concise, practical, and professional. Use markdown formatting for better readability.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 min-h-screen">
      <Card className="h-[700px] flex flex-col bg-gradient-to-br from-gray-800/95 to-slate-900/95 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border-b border-slate-700/50">
          <CardTitle className="text-2xl font-bold flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 rounded-2xl shadow-lg">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Career Assistant
              </span>
              <span className="text-sm text-gray-400 font-normal">Your Personal Career Coach</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-6 space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 text-white shadow-indigo-500/25'
                        : 'bg-gradient-to-br from-gray-700/90 to-slate-800/90 border border-slate-600/50 text-gray-100'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{message.content}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center shadow-lg flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-gray-700/90 to-slate-800/90 rounded-2xl px-5 py-4 border border-slate-600/50 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-sm text-gray-300 ml-2 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-3 items-end pt-4 border-t border-slate-700/50">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your career, resume optimization, job search strategies, or interview preparation..."
              className="flex-1 min-h-[50px] max-h-[120px] resize-none border-slate-600 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl bg-gray-700/80 text-gray-100 placeholder:text-gray-400"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-700 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 rounded-xl"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
