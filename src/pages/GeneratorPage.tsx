
import { useState } from 'react';
import ResumeGenerator from '../components/ResumeGenerator';

const GeneratorPage = () => {
  const [generatedResume, setGeneratedResume] = useState('');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">AI Resume Generator</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional, ATS-optimized resumes powered by AI
        </p>
      </div>
      <ResumeGenerator onResumeGenerated={setGeneratedResume} />
    </div>
  );
};

export default GeneratorPage;
