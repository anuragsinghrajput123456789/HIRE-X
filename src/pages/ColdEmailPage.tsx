
import ColdEmailGenerator from '../components/ColdEmailGenerator';

const ColdEmailPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Cold Email Generator</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate personalized cold emails and send them directly to potential employers and recruiters
        </p>
      </div>
      <ColdEmailGenerator />
    </div>
  );
};

export default ColdEmailPage;
