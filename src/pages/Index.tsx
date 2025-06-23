
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '../components/ThemeToggle';
import ResumeGenerator from '../components/ResumeGenerator';
import ResumeAnalyzer from '../components/ResumeAnalyzer';
import JobSuggestions from '../components/JobSuggestions';
import PDFExport from '../components/PDFExport';

const Index = () => {
  const [generatedResume, setGeneratedResume] = useState('');

  return (
    <div className="min-h-screen gradient-bg">
      <ThemeToggle />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">AI Resume Builder</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create ATS-optimized resumes, analyze existing ones, and get personalized job recommendations powered by AI
          </p>
          <div className="flex justify-center items-center gap-4 mt-6">
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        {/* Main Tabs */}
        <Tabs defaultValue="generator" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 lg:grid-cols-4">
              <TabsTrigger value="generator">Generator</TabsTrigger>
              <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
              <TabsTrigger value="suggestions">Job Match</TabsTrigger>
              <TabsTrigger value="export" className="hidden lg:flex">Export</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <PDFExport content={generatedResume} filename="ai-generated-resume" />
            </div>
          </div>

          <TabsContent value="generator" className="animate-fade-in">
            <ResumeGenerator onResumeGenerated={setGeneratedResume} />
          </TabsContent>

          <TabsContent value="analyzer" className="animate-fade-in">
            <ResumeAnalyzer />
          </TabsContent>

          <TabsContent value="suggestions" className="animate-fade-in">
            <JobSuggestions />
          </TabsContent>

          <TabsContent value="export" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="gradient-text">Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Export your AI-generated resume in various formats for different applications.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <PDFExport content={generatedResume} filename="resume" />
                    <button 
                      className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
                      onClick={() => {
                        if (generatedResume) {
                          navigator.clipboard.writeText(generatedResume);
                        }
                      }}
                    >
                      📋 Copy Text
                    </button>
                  </div>
                  {generatedResume && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Preview:</h4>
                      <div className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                        {generatedResume.substring(0, 300)}...
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes your information and creates optimized resumes
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">ATS Optimized</h3>
              <p className="text-sm text-muted-foreground">
                Ensures your resume passes Applicant Tracking Systems
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Smart Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed feedback and improvement suggestions
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="font-semibold mb-2">Job Matching</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized job recommendations and career guidance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
