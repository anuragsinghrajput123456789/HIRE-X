
import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { analyzeResume, generateResumeContent, type AnalysisResult } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, FileText, Sparkles, Download, Upload, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCorrections, setIsGeneratingCorrections] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [corrections, setCorrections] = useState('');
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
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCorrections = async () => {
    if (!analysis) {
      toast({
        title: "No Analysis Available",
        description: "Please analyze your resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCorrections(true);
    try {
      const prompt = `Based on this resume analysis, generate a corrected and improved version of the resume:

Original Resume:
${resumeText}

Analysis Results:
- ATS Score: ${analysis.atsScore}/100
- Missing Keywords: ${analysis.missingKeywords.join(', ')}
- Format Suggestions: ${analysis.formatSuggestions.join(', ')}
- Improvements: ${analysis.improvements.join(', ')}

Please provide a complete, improved resume that addresses all the issues identified in the analysis. Make it ATS-friendly and professional.`;

      const correctedResume = await generateResumeContent(prompt);
      setCorrections(correctedResume);
      toast({
        title: "Corrections Generated",
        description: "Your improved resume has been generated!",
      });
    } catch (error) {
      console.error('Correction generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate corrections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCorrections(false);
    }
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (score >= 60) return <AlertCircle className="w-8 h-8 text-yellow-500" />;
    return <XCircle className="w-8 h-8 text-red-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ATS Approved - Excellent';
    if (score >= 60) return 'ATS Partial - Good';
    return 'ATS Rejected - Needs Improvement';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <div className="text-4xl animate-bounce">
                  {isDragActive ? <Download className="w-12 h-12 mx-auto text-primary" /> : <Upload className="w-12 h-12 mx-auto text-muted-foreground" />}
                </div>
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
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <div className="space-y-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="gradient-text">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score with Animation */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg animate-scale-in">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-pulse">
                      {getScoreIcon(analysis.atsScore)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
                  <div className="text-4xl font-bold gradient-text mb-2 animate-fade-in">
                    {analysis.atsScore}/100
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 font-medium">
                    {getScoreLabel(analysis.atsScore)}
                  </p>
                  <Progress
                    value={analysis.atsScore}
                    className="w-full h-3 animate-fade-in"
                  />
                </div>

                {/* Generate Corrections Button */}
                <Button
                  onClick={handleGenerateCorrections}
                  disabled={isGeneratingCorrections}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105"
                >
                  {isGeneratingCorrections ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Corrections...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Corrections
                    </>
                  )}
                </Button>

                {/* Missing Keywords */}
                <div className="animate-slide-in-right">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="destructive" className="animate-fade-in hover:scale-105 transition-transform">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Format Suggestions */}
                <div className="animate-slide-in-right">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    Format Suggestions
                  </h4>
                  <ul className="space-y-2">
                    {analysis.formatSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="animate-slide-in-right">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Recommended Improvements
                  </h4>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Matching Job Roles */}
                <div className="animate-slide-in-right">
                  <h4 className="font-semibold mb-3">Matching Job Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingJobRoles.map((role, index) => (
                      <Badge key={index} variant="outline" className="animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: `${index * 0.1}s`}}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12 animate-pulse">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Analysis results will appear here</p>
                <p className="text-sm mt-2">Upload your resume and click "Analyze Resume" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Corrections Section */}
        {corrections && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI-Generated Corrections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Improved Resume:</h4>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm">{corrections}</pre>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(corrections);
                    toast({
                      title: "Copied to Clipboard",
                      description: "The corrected resume has been copied to your clipboard.",
                    });
                  }}
                  variant="outline"
                  className="w-full hover:scale-105 transition-transform"
                >
                  Copy Corrected Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
