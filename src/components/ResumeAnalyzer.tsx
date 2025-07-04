
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  BookOpen,
  Eye,
  Type,
  Settings,
  BarChart3,
  Search,
  Zap,
  ArrowRight,
  Briefcase,
  Star,
  Wand2,
  Copy,
  CheckCheck
} from 'lucide-react';

const jobRoles = [
  'Software Developer',
  'Data Analyst',
  'Product Manager',
  'Marketing Manager',
  'Sales Representative',
  'Project Manager',
  'Business Analyst',
  'UX/UI Designer',
  'DevOps Engineer',
  'Customer Success Manager',
  'Financial Analyst',
  'HR Specialist',
  'Operations Manager',
  'Content Writer',
  'Digital Marketing Specialist'
];

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
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
        text = await file.text();
      }
      
      setUploadProgress(70);
      
      // Improved text cleaning
      text = text
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,;:()\-@]/g, '')
        .trim();
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
      if (text.length < 150) {
        throw new Error('Document appears to contain insufficient content for analysis. Please ensure the file contains a complete resume with substantive text.');
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
      
      toast({
        title: "Resume Uploaded Successfully",
        description: `Document processed successfully! ${text.length} characters extracted.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process document. Please try with a different file format or check if the file contains readable text.",
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
        description: "Please upload a resume document or paste resume text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (resumeText.length < 200) {
      toast({
        title: "Resume Too Short",
        description: "Please provide a more complete resume for accurate analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setIsRetrying(false);
    
    try {
      console.log('Starting comprehensive resume analysis...');
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
          description: "The AI service is overloaded. Please wait a moment and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Unable to analyze resume. Please check your content and try again.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl">
              <Search className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Resume Analyzer
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                <span className="text-lg font-medium text-purple-600 dark:text-purple-400">AI-Powered Analysis</span>
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Get comprehensive ATS analysis and AI-powered recommendations to optimize your resume for your dream job.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
          
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            {/* Job Role Selection Card */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  Target Job Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
                  <SelectTrigger className="w-full h-12 text-base bg-white dark:bg-gray-800 border-2 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Choose your target position..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((role) => (
                      <SelectItem key={role} value={role} className="text-base py-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          {role}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Resume Upload Card */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-xl">
                    <File className="w-6 h-6 text-green-600" />
                  </div>
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  {...getRootProps()}
                  className={`relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 group ${
                    isDragActive
                      ? 'border-green-500 bg-green-500/10 scale-105 shadow-2xl'
                      : 'border-green-300 hover:border-green-500 hover:bg-green-500/5 hover:scale-102'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className={`p-4 rounded-full mx-auto w-fit ${isDragActive ? 'bg-green-500 animate-bounce' : 'bg-green-500/10 group-hover:bg-green-500/20'} transition-all duration-300`}>
                      <Upload className={`w-12 h-12 ${isDragActive ? 'text-white' : 'text-green-600'} transition-colors duration-300`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                        {isDragActive ? 'Drop your resume here!' : 'Drag & Drop or Click to Upload'}
                      </p>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        PDF, DOC, DOCX, TXT • Max 10MB
                      </p>
                    </div>
                    
                    {uploadProgress > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-green-700">Processing your resume...</p>
                        <Progress value={uploadProgress} className="w-full h-3" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="resume-text" className="text-base font-semibold text-green-800 dark:text-green-200">
                    Or paste your resume text:
                  </Label>
                  <Textarea
                    id="resume-text"
                    placeholder="Paste your complete resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[200px] text-base border-2 hover:border-green-400 focus:border-green-500 transition-colors resize-vertical"
                  />
                  {resumeText && (
                    <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                      <span>{resumeText.length.toLocaleString()} characters</span>
                      {fileName && <span className="font-medium">File: {fileName}</span>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            <Card className="border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-teal-800 dark:text-teal-200 flex items-center gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-xl">
                    <Brain className="w-6 h-6 text-teal-600" />
                  </div>
                  AI Resume Analysis
                </CardTitle>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeText.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-6">
                    {/* ATS Score Display */}
                    <div className={`text-center p-8 bg-gradient-to-br ${getScoreColor(analysis.atsScore)} rounded-2xl text-white shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                      <div className="flex items-center justify-center mb-4">
                        {getScoreIcon(analysis.atsScore)}
                      </div>
                      <h3 className="text-2xl font-bold mb-3">ATS Compatibility Score</h3>
                      <div className="text-5xl font-bold mb-4">
                        {analysis.atsScore}/100
                      </div>
                      <p className="text-xl font-bold mb-4">
                        {getScoreLabel(analysis.atsScore)}
                      </p>
                      <Progress value={analysis.atsScore} className="w-full h-4 bg-white/20" />
                    </div>

                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-red-200">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-red-700 dark:text-red-300">
                          <XCircle className="w-5 h-5" />
                          Format Issues to Fix
                        </h4>
                        <ul className="space-y-2">
                          {analysis.formatSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                              <ArrowRight className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-red-700 dark:text-red-300">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <TrendingUp className="w-5 h-5" />
                          Content Improvements
                        </h4>
                        <ul className="space-y-2">
                          {analysis.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                              <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-700 dark:text-blue-300">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-green-200">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
                          <Plus className="w-5 h-5" />
                          Keywords to Add
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700 bg-green-50">
                              + {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-purple-200">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                          <Award className="w-5 h-5" />
                          Best Matching Roles ({analysis.matchingJobRoles.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.matchingJobRoles.map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-sm border-purple-300 text-purple-700 bg-purple-50 px-3 py-1">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      variant="outline"
                      disabled={isAnalyzing}
                      className="w-full border-2 border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-analyze Resume
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="space-y-6">
                      <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-full w-fit mx-auto">
                        <Brain className="w-16 h-16 text-teal-600 opacity-60" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-teal-800 dark:text-teal-200">Ready for Complete Analysis</p>
                        <p className="text-teal-600 dark:text-teal-400 mt-3 text-lg">
                          Upload your resume and click "Analyze Resume" for comprehensive ATS scoring
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isRetrying && (
                  <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl">
                    <div className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
                      <Clock className="w-6 h-6" />
                      <div>
                        <p className="font-bold">AI Service Temporarily Unavailable</p>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                          The AI service is currently overloaded. Please wait a moment and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
