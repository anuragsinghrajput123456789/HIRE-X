
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJobSuggestions } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

const JobSuggestions = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Resume Text",
        description: "Please paste your resume content to get job suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await getJobSuggestions(resumeText, targetRole || undefined);
      setSuggestions(result);
      toast({
        title: "Suggestions Generated",
        description: "AI-powered job recommendations are ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">Get Job Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="resumeText">Resume Content *</Label>
            <Textarea
              id="resumeText"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your complete resume content here..."
              rows={12}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="targetRole">Target Role (Optional)</Label>
            <Input
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Software Engineer, Data Scientist"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank for general recommendations based on your resume
            </p>
          </div>

          <Button
            onClick={handleGetSuggestions}
            disabled={isLoading || !resumeText.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? 'Generating Suggestions...' : 'Get AI Job Recommendations'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions ? (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{suggestions}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg">Job recommendations will appear here</p>
              <p className="text-sm mt-2">Paste your resume content and click the button to get personalized suggestions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSuggestions;
