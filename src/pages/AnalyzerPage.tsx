
import ResumeAnalyzer from '../components/ResumeAnalyzer';

const AnalyzerPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Resume Analyzer</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get detailed analysis and improvement suggestions for your resume
        </p>
      </div>
      <ResumeAnalyzer />
    </div>
  );
};

export default AnalyzerPage;
