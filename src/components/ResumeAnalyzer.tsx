import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { analyzeResume, analyzeResumeRealTime, type AnalysisResult, type RealTimeAnalysis } from '../services/geminiApi';
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
  BarChart3
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
  const [isRealTimeAnalyzing, setIsRealTimeAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<RealTimeAnalysis | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  // Real-time analysis with debouncing
  const performRealTimeAnalysis = useCallback(async (text: string, jobRole: string) => {
    if (text.length < 50 || !jobRole) return;
    
    setIsRealTimeAnalyzing(true);
    try {
      const result = await analyzeResumeRealTime(text, jobRole);
      setRealTimeAnalysis(result);
    } catch (error) {
      console.error('Real-time analysis error:', error);
    } finally {
      setIsRealTimeAnalyzing(false);
    }
  }, []);

  // Debounced real-time analysis
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (resumeText && selectedJobRole) {
        performRealTimeAnalysis(resumeText, selectedJobRole);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [resumeText, selectedJobRole, performRealTimeAnalysis]);

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
      
      text = text.replace(/\s+/g, ' ').trim();
      
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* Left Column - Upload & Job Role Selection */}
      <div className="space-y-6">
        {/* Job Role Selection */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="w-6 h-6" />
              </div>
              Select Target Job Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="job-role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose the job role you're targeting
            </Label>
            <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a job role..." />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <File className="w-6 h-6" />
              </div>
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Upload className={`w-12 h-12 mx-auto ${isDragActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-lg font-semibold mb-2">
                    {isDragActive ? 'Drop your resume here!' : 'Upload or drag & drop'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC, DOCX, TXT • Max 10MB
                  </p>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Processing...</p>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Manual Text Input */}
            <div className="space-y-2">
              <Label htmlFor="resume-text" className="text-sm font-medium">
                Or paste your resume text here:
              </Label>
              <Textarea
                id="resume-text"
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[200px] resize-vertical"
              />
              {resumeText && (
                <p className="text-xs text-muted-foreground">
                  {resumeText.length} characters • {fileName && `File: ${fileName}`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Column - Real-time Analysis */}
      <div className="space-y-6">
        <Card className="border-2 border-blue/20">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
              Real-time Analysis
              {isRealTimeAnalyzing && <Loader2 className="w-5 h-5 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {realTimeAnalysis && selectedJobRole ? (
              <div className="space-y-6">
                {/* Keyword Matching */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Target className="w-5 h-5" />
                    Keyword Match ({realTimeAnalysis.keywordMatchScore}%)
                  </h4>
                  <Progress value={realTimeAnalysis.keywordMatchScore} className="mb-3" />
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Found Keywords: {realTimeAnalysis.foundKeywords.join(', ')}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ✗ Missing Keywords: {realTimeAnalysis.missingKeywords.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Readability Score */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Eye className="w-5 h-5" />
                    Readability Score ({realTimeAnalysis.readabilityScore}%)
                  </h4>
                  <Progress value={realTimeAnalysis.readabilityScore} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {realTimeAnalysis.readabilityScore >= 80 ? 'Excellent readability' :
                     realTimeAnalysis.readabilityScore >= 60 ? 'Good readability' : 'Needs improvement'}
                  </p>
                </div>

                {/* Structure Analysis */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Settings className="w-5 h-5" />
                    Resume Structure
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(realTimeAnalysis.structureAnalysis).map(([section, present]) => (
                      <div key={section} className="flex items-center gap-2 text-sm">
                        {present ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={present ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {section}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formatting Issues */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <Type className="w-5 h-5" />
                    Formatting Issues ({realTimeAnalysis.formattingIssues.length})
                  </h4>
                  {realTimeAnalysis.formattingIssues.length > 0 ? (
                    <ul className="space-y-1">
                      {realTimeAnalysis.formattingIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-orange-600 dark:text-orange-400">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      No formatting issues detected
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="w-16 h-16 mx-auto opacity-30 mb-4" />
                <p className="text-lg font-medium">Real-time Analysis</p>
                <p className="text-sm mt-2">
                  {!selectedJobRole ? 'Select a job role to start' : 'Upload or paste your resume to see real-time analysis'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Full Analysis Results */}
      <div className="space-y-6">
        <Card className="border-2 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              Full ATS Analysis
            </CardTitle>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score */}
                <div className={`text-center p-6 bg-gradient-to-br ${getScoreColor(analysis.atsScore)} rounded-xl text-white shadow-lg`}>
                  <div className="flex items-center justify-center mb-4">
                    {getScoreIcon(analysis.atsScore)}
                  </div>
                  <h3 className="text-xl font-bold mb-2">ATS Score</h3>
                  <div className="text-4xl font-bold mb-3">
                    {analysis.atsScore}/100
                  </div>
                  <p className="text-lg font-semibold mb-2">
                    {getScoreLabel(analysis.atsScore)}
                  </p>
                  <Progress value={analysis.atsScore} className="w-full h-3 bg-white/20" />
                </div>

                {/* Improvement Tips Section */}
                <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Improvement Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Things to Add */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Plus className="w-5 h-5" />
                        Keywords to Add
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {analysis.missingKeywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-700 dark:text-green-300">
                            + {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Things to Fix */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Minus className="w-5 h-5" />
                        Issues to Fix
                      </h4>
                      <ul className="space-y-2">
                        {analysis.formatSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 dark:text-red-300">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Items */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <TrendingUp className="w-5 h-5" />
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-700 dark:text-blue-300">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Matching Job Roles */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Target className="w-5 h-5" />
                    Matching Roles ({analysis.matchingJobRoles.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingJobRoles.map((role, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  variant="outline"
                  disabled={isAnalyzing}
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-analyze Resume
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="space-y-4">
                  <Brain className="w-20 h-20 mx-auto opacity-30" />
                  <div>
                    <p className="text-xl font-medium">Ready for Full Analysis</p>
                    <p className="text-sm mt-2">Upload your resume and click "Analyze" for detailed ATS scoring and recommendations</p>
                  </div>
                </div>
              </div>
            )}

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
