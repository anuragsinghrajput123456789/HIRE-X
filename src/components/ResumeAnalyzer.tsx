
import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { analyzeResume, type AnalysisResult } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await extractTextFromPDF(file);
      setResumeText(text);
      toast({
        title: "Resume Uploaded Successfully",
        description: "PDF text extracted. You can now analyze your resume.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to extract text from PDF. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Resume Text",
        description: "Please upload a PDF or paste resume text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="gradient-text">Upload Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <div className="text-4xl">📄</div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Drop your resume here'
                    : 'Drag & drop your resume (PDF only)'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to select a file
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Or paste your resume text below:</p>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                rows={8}
                className="w-full"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="gradient-text">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {analysis.atsScore}/100
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {getScoreLabel(analysis.atsScore)}
                  </p>
                  <Progress
                    value={analysis.atsScore}
                    className="w-full h-3"
                  />
                </div>

                {/* Missing Keywords */}
                <div>
                  <h4 className="font-semibold mb-3">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="destructive">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Format Suggestions */}
                <div>
                  <h4 className="font-semibold mb-3">Format Suggestions</h4>
                  <ul className="space-y-2">
                    {analysis.formatSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <h4 className="font-semibold mb-3">Recommended Improvements</h4>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Matching Job Roles */}
                <div>
                  <h4 className="font-semibold mb-3">Matching Job Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingJobRoles.map((role, index) => (
                      <Badge key={index} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">Analysis results will appear here</p>
                <p className="text-sm mt-2">Upload your resume and click "Analyze Resume" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
