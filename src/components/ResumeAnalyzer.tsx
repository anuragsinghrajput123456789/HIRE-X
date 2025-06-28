
import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { analyzeResume, type AnalysisResult } from '../services/geminiApi';
import { extractTextFromPDF, extractTextFromWordDoc } from '../services/pdfTextExtractor';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Upload, 
  Loader2,
  Brain,
  Target,
  Award,
  RefreshCw,
  Clock,
  File,
  TrendingUp,
  Lightbulb,
  Plus,
  Minus,
  BookOpen
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      setUploadProgress(10);
      console.log('Starting text extraction for file:', file.name, 'Type:', file.type);
      
      let text = '';
      
      if (file.type === 'application/pdf') {
        setUploadProgress(30);
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        setUploadProgress(30);
        text = await file.text();
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        setUploadProgress(30);
        text = await extractTextFromWordDoc(file);
      } else {
        setUploadProgress(30);
        // Try to read as text for other formats
        text = await file.text();
      }
      
      setUploadProgress(70);
      
      // Final text cleaning
      text = text
        .replace(/\s+/g, ' ')
        .trim();
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
      if (text.length < 100) {
        throw new Error('Document appears to be empty or contains insufficient content for analysis. Please try a different file format.');
      }
      
      console.log('Text extraction successful, length:', text.length);
      return text;
      
    } catch (error) {
      console.error('Error extracting text from file:', error);
      setUploadProgress(0);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('File dropped:', file.name, 'Type:', file.type, 'Size:', file.size);

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setFileName(file.name);
      setAnalysis(null);
      setIsRetrying(false);
      
      console.log('Text extraction successful, length:', text.length);
      toast({
        title: "Resume Uploaded Successfully",
        description: `Document processed successfully! ${text.length} characters extracted.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process document. Please try with a different file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Resume Content",
        description: "Please upload a resume document to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setIsRetrying(false);
    
    try {
      console.log('Starting resume analysis...');
      const result = await analyzeResume(resumeText);
      console.log('Analysis completed successfully:', result);
      setAnalysis(result);
      
      toast({
        title: "Analysis Complete",
        description: `Your resume has been analyzed! ATS Score: ${result.atsScore}/100`,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      const isRetryableError = error.message?.includes('overloaded') || 
                              error.message?.includes('quota') ||
                              error.message?.includes('503') ||
                              error.message?.includes('429');
      
      if (isRetryableError) {
        setIsRetrying(true);
        toast({
          title: "AI Service Temporarily Unavailable",
          description: "The AI service is overloaded. You can retry in a moment.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Failed",
        description: error.message || "Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-8 h-8 text-green-500" />;
    if (score >= 60) return <Target className="w-8 h-8 text-yellow-500" />;
    return <AlertCircle className="w-8 h-8 text-red-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ATS Approved - Excellent';
    if (score >= 60) return 'ATS Partial - Good';
    return 'ATS Rejected - Needs Improvement';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <File className="w-6 h-6" />
              </div>
              Upload Your Resume (PDF, DOC, DOCX, TXT)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-6xl">
                  {isDragActive ? (
                    <Upload className="w-16 h-16 mx-auto text-primary animate-pulse" />
                  ) : (
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2">
                    {isDragActive
                      ? 'Drop your resume here!'
                      : 'Drag & drop your resume'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supports PDF, DOC, DOCX, TXT • Max size: 10MB
                  </p>
                  {resumeText && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {fileName} uploaded ({resumeText.length} characters)
                    </div>
                  )}
                </div>
                
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Processing document...</p>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>
            </div>

            {isRetrying && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Clock className="w-5 h-5" />
                  <p className="text-sm font-medium">AI Service Temporarily Unavailable</p>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  The AI service is currently overloaded. Please wait a moment and try again.
                </p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze Resume with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <div className="space-y-6">
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              ATS Analysis & Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score */}
                <div className={`text-center p-6 bg-gradient-to-br ${getScoreColor(analysis.atsScore)} rounded-xl text-white shadow-lg`}>
                  <div className="flex items-center justify-center mb-4">
                    {getScoreIcon(analysis.atsScore)}
                  </div>
                  <h3 className="text-xl font-bold mb-2">ATS Compatibility Score</h3>
                  <div className="text-4xl font-bold mb-3">
                    {analysis.atsScore}/100
                  </div>
                  <p className="text-lg font-semibold mb-2">
                    {getScoreLabel(analysis.atsScore)}
                  </p>
                  <div className="mt-4">
                    <Progress
                      value={analysis.atsScore}
                      className="w-full h-3 bg-white/20"
                    />
                  </div>
                </div>

                {/* Improvement Tips Section */}
                <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      How to Improve Your Resume for ATS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Things to Add */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Plus className="w-5 h-5" />
                        What to ADD to Your Resume
                      </h4>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-700 dark:text-green-300">
                              + {keyword}
                            </Badge>
                          ))}
                        </div>
                        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 mb-2 font-medium">💡 Pro Tips:</p>
                          <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                            <li>• Naturally integrate these keywords into your experience bullets</li>
                            <li>• Add them to your skills section if relevant</li>
                            <li>• Include them in your professional summary</li>
                            <li>• Use variations of keywords (e.g., "manage" and "management")</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Things to Remove/Fix */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Minus className="w-5 h-5" />
                        What to REMOVE or FIX
                      </h4>
                      <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <ul className="space-y-2">
                          {analysis.formatSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-red-700 dark:text-red-300">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Improvement Actions */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <TrendingUp className="w-5 h-5" />
                        Action Items for Better ATS Score
                      </h4>
                      <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <ul className="space-y-2">
                          {analysis.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-700 dark:text-blue-300">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matching Job Roles */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Target className="w-5 h-5" />
                      Matching Roles ({analysis.matchingJobRoles.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchingJobRoles.map((role, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Additional Tips */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <BookOpen className="w-5 h-5" />
                      General ATS Tips
                    </h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                        <li>• Use standard section headers (Experience, Education, Skills)</li>
                        <li>• Avoid images, graphics, and fancy formatting</li>
                        <li>• Use bullet points for easy scanning</li>
                        <li>• Include quantifiable achievements with numbers</li>
                        <li>• Save as PDF to preserve formatting</li>
                        <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Retry Button */}
                <div className="text-center">
                  <Button
                    onClick={handleAnalyze}
                    variant="outline"
                    disabled={isAnalyzing}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-analyze Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="space-y-4">
                  <Brain className="w-20 h-20 mx-auto opacity-30" />
                  <div>
                    <p className="text-xl font-medium">Ready for ATS Analysis</p>
                    <p className="text-sm mt-2">Upload your resume and get detailed tips on how to make it ATS-friendly</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
