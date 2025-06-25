
import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { analyzeResume, generateResumeContent, type AnalysisResult } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Download, 
  Upload, 
  Loader2,
  Brain,
  Target,
  TrendingUp,
  Award,
  RefreshCw,
  Zap,
  Copy,
  Star,
  Clock
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCorrections, setIsGeneratingCorrections] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [corrections, setCorrections] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      setUploadProgress(10);
      
      const arrayBuffer = await file.arrayBuffer();
      setUploadProgress(30);
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setUploadProgress(50);
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
        setUploadProgress(50 + (i / pdf.numPages) * 40);
      }
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
      if (!fullText.trim() || fullText.trim().length < 50) {
        throw new Error('No readable text found in PDF. Please ensure your PDF contains selectable text.');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      setUploadProgress(0);
      throw new Error('Failed to extract text from PDF. Please ensure it contains readable text.');
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

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a PDF file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await extractTextFromPDF(file);
      setResumeText(text);
      setQuotaExceeded(false);
      toast({
        title: "Resume Uploaded Successfully",
        description: `PDF text extracted successfully! ${text.length} characters found.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process PDF file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Resume Text",
        description: "Please upload a PDF resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (resumeText.trim().length < 50) {
      toast({
        title: "Resume Too Short",
        description: "Please provide a more detailed resume for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setQuotaExceeded(false);
    
    try {
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      if (error.message?.includes('quota') || error.message?.includes('429') || error.status === 429) {
        setQuotaExceeded(true);
        toast({
          title: "API Quota Exceeded",
          description: "The AI service quota has been exceeded. Please try again in a few minutes or upgrade your API plan.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
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
    setQuotaExceeded(false);
    
    try {
      const prompt = `Based on this resume analysis, generate a complete, corrected and improved ATS-friendly version of the resume:

Original Resume:
${resumeText}

Analysis Results:
- ATS Score: ${analysis.atsScore}/100
- Missing Keywords: ${analysis.missingKeywords.join(', ')}
- Format Suggestions: ${analysis.formatSuggestions.join(', ')}
- Improvements: ${analysis.improvements.join(', ')}

Please provide a complete, professionally formatted resume that addresses all the issues identified. Make it highly ATS-friendly with:
1. All missing keywords naturally integrated
2. Professional formatting with clear sections
3. Quantifiable achievements with metrics
4. Strong action verbs throughout
5. Industry-standard terminology
6. Proper ATS-readable structure

Format the output as a complete, ready-to-use resume.`;

      const correctedResume = await generateResumeContent(prompt);
      setCorrections(correctedResume);
      toast({
        title: "ATS-Friendly Resume Generated!",
        description: "Your improved resume is ready for download.",
      });
    } catch (error: any) {
      console.error('Correction generation error:', error);
      
      if (error.message?.includes('quota') || error.message?.includes('429') || error.status === 429) {
        setQuotaExceeded(true);
        toast({
          title: "API Quota Exceeded",
          description: "The AI service quota has been exceeded. Please try again in a few minutes or upgrade your API plan.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate ATS-friendly resume. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGeneratingCorrections(false);
    }
  };

  const downloadATSResume = () => {
    if (!corrections) return;
    
    const element = document.createElement('a');
    const file = new Blob([corrections], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'ATS_Friendly_Resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Resume Downloaded",
      description: "Your ATS-friendly resume has been downloaded successfully!",
    });
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-8 h-8 text-green-500 animate-pulse" />;
    if (score >= 60) return <Target className="w-8 h-8 text-yellow-500 animate-bounce" />;
    return <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />;
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

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Your resume is well-optimized for ATS systems!';
    if (score >= 60) return 'Your resume has potential but needs some improvements.';
    return 'Your resume needs significant improvements to pass ATS filters.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card className="animate-fade-in border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="w-6 h-6" />
              </div>
              Upload Your Resume (PDF Only)
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
                <div className="text-6xl animate-bounce">
                  {isDragActive ? (
                    <Download className="w-16 h-16 mx-auto text-primary animate-pulse" />
                  ) : (
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2">
                    {isDragActive
                      ? 'Drop your resume here!'
                      : 'Drag & drop your resume (PDF only)'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to select a file • Max size: 10MB
                  </p>
                  {resumeText && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Resume uploaded ({resumeText.length} characters)
                    </p>
                  )}
                </div>
                
                {uploadProgress > 0 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="text-sm font-medium">Processing PDF...</p>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>
            </div>

            {quotaExceeded && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Clock className="w-5 h-5" />
                  <p className="text-sm font-medium">API Quota Exceeded</p>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Please wait a few minutes before trying again, or upgrade your Gemini API plan for higher quotas.
                </p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim() || quotaExceeded}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
        <Card className="animate-fade-in border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score */}
                <div className={`text-center p-8 bg-gradient-to-br ${getScoreColor(analysis.atsScore)} rounded-xl text-white animate-scale-in shadow-lg`}>
                  <div className="flex items-center justify-center mb-4">
                    {getScoreIcon(analysis.atsScore)}
                  </div>
                  <h3 className="text-xl font-bold mb-2">ATS Compatibility Score</h3>
                  <div className="text-5xl font-bold mb-3 animate-fade-in">
                    {analysis.atsScore}/100
                  </div>
                  <p className="text-lg font-semibold mb-2">
                    {getScoreLabel(analysis.atsScore)}
                  </p>
                  <p className="text-sm opacity-90">
                    {getScoreMessage(analysis.atsScore)}
                  </p>
                  <div className="mt-4">
                    <Progress
                      value={analysis.atsScore}
                      className="w-full h-3 bg-white/20"
                    />
                  </div>
                </div>

                {/* ATS Improvement Section */}
                {analysis.atsScore < 90 && (
                  <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                    <CardHeader>
                      <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Generate ATS-Friendly Resume
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        Let our AI create an optimized version of your resume that passes ATS filters and impresses recruiters!
                      </p>
                      
                      <Button
                        onClick={handleGenerateCorrections}
                        disabled={isGeneratingCorrections || quotaExceeded}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
                      >
                        {isGeneratingCorrections ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating ATS-Friendly Resume...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Generate ATS-Friendly Resume
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleGenerateCorrections}
                    disabled={isGeneratingCorrections || quotaExceeded}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
                  >
                    {isGeneratingCorrections ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        AI Improve Resume
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleAnalyze}
                    variant="outline"
                    disabled={isAnalyzing || quotaExceeded}
                    className="hover:scale-[1.02] transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-analyze
                  </Button>
                </div>

                {/* Analysis Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Missing Keywords */}
                  <div className="animate-slide-in-right">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5" />
                      Missing Keywords ({analysis.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="destructive" 
                          className="animate-fade-in hover:scale-105 transition-transform text-xs"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Matching Job Roles */}
                  <div className="animate-slide-in-right">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Target className="w-5 h-5" />
                      Matching Roles ({analysis.matchingJobRoles.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {analysis.matchingJobRoles.map((role, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="animate-fade-in hover:scale-105 transition-transform text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-4">
                  <div className="animate-slide-in-right">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-5 h-5" />
                      Format Suggestions
                    </h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {analysis.formatSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3 animate-fade-in p-2 rounded-lg hover:bg-accent/50 transition-colors" style={{animationDelay: `${index * 0.1}s`}}>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="animate-slide-in-right">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      Recommended Improvements
                    </h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-3 animate-fade-in p-2 rounded-lg hover:bg-accent/50 transition-colors" style={{animationDelay: `${index * 0.1}s`}}>
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12 animate-pulse">
                <div className="space-y-4">
                  <Brain className="w-20 h-20 mx-auto opacity-30" />
                  <div>
                    <p className="text-xl font-medium">Ready for AI Analysis</p>
                    <p className="text-sm mt-2">Upload your resume PDF and click "Analyze Resume" to get started</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Corrections Section */}
        {corrections && (
          <Card className="animate-fade-in border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                Your ATS-Friendly Resume is Ready!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Your ATS-Optimized Resume:
                  </h4>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm bg-white/50 dark:bg-black/20 p-4 rounded-lg border max-h-96 overflow-y-auto font-sans">{corrections}</pre>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(corrections);
                      toast({
                        title: "Copied to Clipboard",
                        description: "The ATS-friendly resume has been copied to your clipboard.",
                      });
                    }}
                    variant="outline"
                    className="hover:scale-[1.02] transition-transform"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>
                  
                  <Button
                    onClick={downloadATSResume}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  
                  <Button
                    onClick={() => setCorrections('')}
                    variant="ghost"
                    className="hover:scale-105 transition-transform"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
