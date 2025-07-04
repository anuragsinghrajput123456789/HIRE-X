
import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🚀 **Welcome to your AI Career Assistant!**\n\nI'm here to help you excel in your career journey. I can assist with:\n\n✨ **Career guidance & strategic planning**\n🎯 **Interview preparation & techniques**\n📝 **Resume optimization & ATS compliance**\n🔍 **Job search strategies & networking**\n💰 **Salary negotiation & benefits**\n📈 **Professional development & skills**\n\n**What career challenge can I help you solve today?**",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

      const prompt = `You are an expert career counselor, interview coach, and job search specialist. The user is asking: "${inputMessage}"

Please provide helpful, actionable advice related to:
- Career guidance and development
- Interview preparation and tips
- Resume writing and optimization
- Job search strategies and techniques
- Salary negotiation tactics
- Professional networking
- Industry insights and trends
- Work-life balance
- Skill development recommendations

Keep your response concise, practical, and professional. Use markdown formatting for better readability. Provide specific, actionable steps when possible.`;

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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className={`fixed ${
            isMobile ? 'bottom-4 right-4 w-16 h-16' : 'bottom-6 right-6 w-18 h-18'
          } rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 z-50 animate-pulse-glow group`}
          size="icon"
        >
          <div className="relative">
            <MessageCircle className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-white transition-transform group-hover:scale-110`} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce"></div>
          </div>
        </Button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <Card className={`fixed ${
          isMobile 
            ? 'bottom-4 right-4 left-4 top-20' 
            : 'bottom-6 right-6 w-96'
        } bg-gradient-to-br from-white/95 via-indigo-50/90 to-purple-50/95 dark:from-gray-900/95 dark:to-indigo-900/95 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-700/50 shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : isMobile ? 'h-full' : 'h-[500px]'
        } overflow-hidden`}>
          <CardHeader className={`${isMobile ? 'pb-3 px-4 pt-4' : 'pb-2'} bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-indigo-200/30`}>
            <div className="flex items-center justify-between">
              <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-bold flex items-center gap-3`}>
                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}>
                  <Bot className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                </div>
                <div className="flex flex-col">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Career Assistant
                  </span>
                  <span className="text-xs text-gray-500 font-normal">AI-Powered Career Coach</span>
                </div>
              </CardTitle>
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMinimize}
                    className="h-8 w-8 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <Minimize2 className="h-4 w-4 text-indigo-600" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className={`${
              isMobile ? 'p-4 pt-0 flex flex-col h-[calc(100%-6rem)]' : 'p-4 pt-0 flex flex-col h-[430px]'
            }`}>
              <ScrollArea className={`flex-1 ${isMobile ? 'pr-2 mb-3' : 'pr-4 mb-4'}`}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                        </div>
                      )}
                      <div
                        className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} rounded-2xl px-4 py-3 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-500/25'
                            : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-600/50'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className={`prose prose-sm dark:prose-invert max-w-none ${isMobile ? 'text-xs' : 'text-xs'}`}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{message.content}</p>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <User className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}>
                        <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                      </div>
                      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className={`flex gap-3 ${isMobile ? 'items-end' : 'items-center'}`}>
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your career journey..."
                  className={`flex-1 ${
                    isMobile 
                      ? 'min-h-[36px] max-h-[60px] text-sm' 
                      : 'min-h-[40px] max-h-[80px]'
                  } resize-none border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl bg-white/80 dark:bg-gray-800/80`}
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 rounded-xl ${
                    isMobile ? 'h-9 w-9' : 'h-10 w-10'
                  }`}
                >
                  <Send className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default FloatingChatbot;
