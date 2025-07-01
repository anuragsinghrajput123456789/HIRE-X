
import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
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
      content: "👋 Hi! I'm your AI Career Assistant. I can help you with:\n\n• **Career advice & guidance**\n• **Interview preparation tips**\n• **Resume optimization**\n• **Job search strategies**\n• **Salary negotiation**\n• **Professional development**\n\nWhat would you like to know?",
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
      {/* Floating Chat Button - Fixed blinking issue */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className={`fixed ${
            isMobile ? 'bottom-4 right-4 w-14 h-14' : 'bottom-6 right-6 w-16 h-16'
          } rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50`}
          size="icon"
        >
          <MessageCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
        </Button>
      )}

      {/* Chat Window - Responsive sizing */}
      {isOpen && (
        <Card className={`fixed ${
          isMobile 
            ? 'bottom-4 right-4 left-4 top-20' // Full width on mobile with safe margins
            : 'bottom-6 right-6 w-96'
        } bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : isMobile ? 'h-full' : 'h-[500px]'
        }`}>
          <CardHeader className={`${isMobile ? 'pb-3 px-4 pt-4' : 'pb-2'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold flex items-center gap-2`}>
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
                  <Bot className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                </div>
                <span className="gradient-text">Career Assistant</span>
              </CardTitle>
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMinimize}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className={`${
              isMobile ? 'p-4 pt-0 flex flex-col h-[calc(100%-5rem)]' : 'p-4 pt-0 flex flex-col h-[430px]'
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
                        <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0`}>
                          <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                        </div>
                      )}
                      <div
                        className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} rounded-lg px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className={`prose prose-sm dark:prose-invert max-w-none ${isMobile ? 'text-xs' : 'text-xs'}`}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{message.content}</p>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0`}>
                          <User className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600 dark:text-gray-300`} />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
                        <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className={`flex gap-2 ${isMobile ? 'items-end' : 'items-center'}`}>
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about careers, interviews, or job search..."
                  className={`flex-1 ${
                    isMobile 
                      ? 'min-h-[36px] max-h-[60px] text-sm' 
                      : 'min-h-[40px] max-h-[80px]'
                  } resize-none`}
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${
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
