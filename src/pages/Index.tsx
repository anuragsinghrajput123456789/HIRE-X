
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, FileText, MessageSquare, Mail, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6">
          <span className="gradient-text">HIRE-X <br />AI Resume Builder</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Create ATS-optimized resumes, analyze existing ones, and get personalized job recommendations powered by AI
        </p>
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-muted-foreground">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-muted-foreground">ATS-Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-muted-foreground">Professional Templates</span>
          </div>
        </div>
        <Link to="/generator">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Start Building Your Resume
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold gradient-text mb-2">10,000+</div>
            <p className="text-sm text-muted-foreground">Resumes Generated</p>
          </CardContent>
        </Card>
        <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <p className="text-sm text-muted-foreground">ATS Success Rate</p>
          </CardContent>
        </Card>
        <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">AI Assistant</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="gradient-text">Powerful Features</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl mb-2">AI Resume Generator</CardTitle>
              <CardDescription>
                Create professional, ATS-optimized resumes with AI assistance tailored to your industry
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/generator">
                <Button className="w-full group-hover:bg-blue-600 transition-colors">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl mb-2">Resume Analyzer</CardTitle>
              <CardDescription>
                Get detailed feedback, ATS compatibility scores, and improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/analyzer">
                <Button className="w-full group-hover:bg-green-600 transition-colors">
                  Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl mb-2">Job Matching</CardTitle>
              <CardDescription>
                Discover personalized job recommendations based on your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/job-match">
                <Button className="w-full group-hover:bg-purple-600 transition-colors">
                  Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl mb-2">Cold Email Generator</CardTitle>
              <CardDescription>
                Generate and send personalized cold emails to potential employers and recruiters
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/cold-email">
                <Button className="w-full group-hover:bg-orange-600 transition-colors">
                  Generate Emails <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl mb-2">Export & Analytics</CardTitle>
              <CardDescription>
                Export your resumes in multiple formats and track your application success
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/export">
                <Button className="w-full group-hover:bg-indigo-600 transition-colors">
                  Export Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="text-xl mb-2">AI Career Assistant</CardTitle>
              <CardDescription>
                Get personalized career advice, interview tips, and resume guidance 24/7
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/chat">
                <Button className="w-full group-hover:bg-pink-600 transition-colors">
                  Chat Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of professionals who've successfully transformed their careers with our AI-powered tools
        </p>
        <Link to="/generator">
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
            Start Your Journey Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
