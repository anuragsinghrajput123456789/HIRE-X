
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, FileText, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6">
          <span className="gradient-text">AI Resume Builder</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Create ATS-optimized resumes, analyze existing ones, and get personalized job recommendations powered by AI
        </p>
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-muted-foreground">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm text-muted-foreground">ATS-Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-sm text-muted-foreground">Professional Templates</span>
          </div>
        </div>
        <Link to="/generator">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Start Building Your Resume
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold gradient-text mb-2">10,000+</div>
            <p className="text-sm text-muted-foreground">Resumes Generated</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <p className="text-sm text-muted-foreground">ATS Success Rate</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">AI Assistant</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Link to="/generator" className="block">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">AI Generator</h3>
              <p className="text-sm text-muted-foreground">
                Create professional resumes with AI assistance
              </p>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Link to="/analyzer" className="block">
              <Target className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Resume Analyzer</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed feedback and ATS optimization tips
              </p>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Link to="/job-match" className="block">
              <FileText className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold mb-2">Job Matching</h3>
              <p className="text-sm text-muted-foreground">
                Discover personalized job recommendations
              </p>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Link to="/chat" className="block">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get career advice and resume tips instantly
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
