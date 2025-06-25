
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Search, Brain } from 'lucide-react';

const ExportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Welcome to ResumeAI</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your all-in-one AI-powered resume and career platform
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="gradient-text text-center">Choose Your Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/generator')}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Resume Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Create professional, ATS-friendly resumes with AI assistance
                  </p>
                  <Button className="w-full" onClick={() => navigate('/generator')}>
                    Generate Resume
                  </Button>
                </div>
              </div>

              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/analyzer')}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Resume Analyzer</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze and improve your existing resume with AI insights
                  </p>
                  <Button className="w-full" onClick={() => navigate('/analyzer')}>
                    Analyze Resume
                  </Button>
                </div>
              </div>

              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/job-match')}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Job Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Find relevant job opportunities across multiple platforms
                  </p>
                  <Button className="w-full" onClick={() => navigate('/job-match')}>
                    Find Jobs
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportPage;
