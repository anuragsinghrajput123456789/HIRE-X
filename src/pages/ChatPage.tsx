
import Chatbot from '../components/Chatbot';

const ChatPage = () => {
  return (
    <div>
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">AI Career Assistant</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get personalized career advice and resume tips from our AI assistant
        </p>
      </div>
      <Chatbot />
    </div>
  );
};

export default ChatPage;
