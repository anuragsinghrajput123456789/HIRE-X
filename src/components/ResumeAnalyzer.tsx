import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { analyzeResume, generateResumeContent, type AnalysisResult } from '../services/geminiApi';
import { extractTextFromPDF, extractTextFromWordDoc } from '../services/pdfTextExtractor';
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
  Award,
  RefreshCw,
  Zap,
  Copy,
  Star,
  Clock,
  File
} from 'lucide-react';
import jsPDF from 'jspdf';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCorrections, setIsGeneratingCorrections] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [correctedResume, setCorrectedResume] = useState('');
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
      setCorrectedResume('');
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
      
      // Automatically generate corrections if score is below 80
      if (result.atsScore < 80) {
        await handleGenerateCorrections(result);
      }
      
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

  const handleGenerateCorrections = async (analysisResult?: AnalysisResult) => {
    const currentAnalysis = analysisResult || analysis;
    if (!currentAnalysis) {
      toast({
        title: "No Analysis Available",
        description: "Please analyze your resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCorrections(true);
    
    try {
      console.log('Starting ATS-friendly resume generation...');
      const prompt = `You are an expert resume writer and ATS optimization specialist. Your task is to create an improved, ATS-friendly version of the provided resume while PRESERVING ALL ORIGINAL INFORMATION AND DETAILS.

CRITICAL INSTRUCTIONS:
1. PRESERVE ALL ORIGINAL CONTENT - Keep every detail, experience, education, project, skill, and achievement from the original resume
2. DO NOT invent or add fake information
3. Only IMPROVE formatting, wording, and ATS compatibility
4. Keep the same chronological order and structure
5. Enhance existing bullet points with better action verbs and quantifiable metrics where possible

ORIGINAL RESUME TO IMPROVE:
${resumeText}

ANALYSIS FINDINGS TO ADDRESS:
- Current ATS Score: ${currentAnalysis.atsScore}/100 (Target: 90+)
- Missing Keywords to Add: ${currentAnalysis.missingKeywords.join(', ')}
- Format Issues to Fix: ${currentAnalysis.formatSuggestions.join(', ')}
- Content Improvements Needed: ${currentAnalysis.improvements.join(', ')}

REQUIRED IMPROVEMENTS:
1. **ATS Optimization**: Integrate missing keywords naturally into existing content
2. **Format Enhancement**: Use clean, ATS-friendly formatting with proper headers
3. **Content Strengthening**: Improve existing bullet points with strong action verbs
4. **Structure Improvement**: Ensure logical flow and readability

OUTPUT FORMAT - Create a complete, professionally formatted resume following this EXACT structure:

[CANDIDATE'S FULL NAME]
[Phone] | [Email] | [Location]
[LinkedIn URL] | [Portfolio/GitHub URL]

PROFESSIONAL SUMMARY
[2-3 lines summarizing the candidate's experience and key strengths with relevant keywords]

TECHNICAL SKILLS
[Organize existing skills into relevant categories with added missing keywords]

PROFESSIONAL EXPERIENCE
[Job Title] - [Company Name] | [Location] | [Dates]
• [Enhanced bullet point with action verb + achievement + impact/metric]
• [Enhanced bullet point with action verb + achievement + impact/metric]
• [Enhanced bullet point with action verb + achievement + impact/metric]

[Continue for all positions from original resume]

EDUCATION
[Degree] - [Institution] | [Location] | [Graduation Date]
[Include GPA, honors, relevant coursework if mentioned in original]

PROJECTS (if applicable)
[Project Name] | [Technologies Used] | [Date]
• [Enhanced description with technical details and outcomes]

CERTIFICATIONS (if applicable)
[List all certifications from original resume]

ADDITIONAL SECTIONS (if applicable)
[Include any other sections from original resume like Languages, Publications, etc.]

FORMATTING REQUIREMENTS:
- Use bullet points consistently
- Employ strong action verbs (Led, Developed, Implemented, Optimized, etc.)
- Include quantifiable achievements where possible
- Ensure consistent date formatting
- Use industry-standard section headers
- Maintain clean, professional layout

Remember: ENHANCE the existing content, don't replace it. Every detail from the original resume must be preserved and improved.`;

      const correctedResumeText = await generateResumeContent(prompt);
      console.log('ATS-friendly resume generated successfully');
      setCorrectedResume(correctedResumeText);
      
      toast({
        title: "ATS-Friendly Resume Generated!",
        description: "Your improved resume is ready for download as PDF.",
      });
    } catch (error: any) {
      console.error('Correction generation error:', error);
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ATS-friendly resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCorrections(false);
    }
  };

  const downloadCorrectedResumeAsPDF = () => {
    if (!correctedResume) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // Parse the resume content
      const lines = correctedResume.split('\n');
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          currentY += 5;
          return;
        }

        // Check if we need a new page
        if (currentY > 270) {
          doc.addPage();
          currentY = margin;
        }

        // Style different sections
        if (index === 0 || trimmedLine.match(/^[A-Z\s]+$/)) {
          // Name or section headers
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          currentY += 8;
        } else if (trimmedLine.includes('|') && index < 5) {
          // Contact info
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          currentY += 2;
        } else if (trimmedLine.startsWith('•')) {
          // Bullet points
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          currentY += 2;
        } else {
          // Regular text
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          currentY += 3;
        }

        // Split long lines
        const splitText = doc.splitTextToSize(trimmedLine, maxWidth);
        
        if (Array.isArray(splitText)) {
          splitText.forEach((textLine: string) => {
            if (currentY > 270) {
              doc.addPage();
              currentY = margin;
            }
            doc.text(textLine, margin, currentY);
            currentY += 5;
          });
        } else {
          doc.text(splitText, margin, currentY);
          currentY += 5;
        }
      });

      // Save the PDF
      doc.save(`ATS_Optimized_${fileName || 'Resume'}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your ATS-optimized resume has been downloaded as PDF successfully!",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try downloading as text instead.",
        variant: "destructive",
      });
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
                    <Download className="w-16 h-16 mx-auto text-primary animate-pulse" />
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
              AI Analysis & Correction Results
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

                {/* Auto-Correction Download Section */}
                {(isGeneratingCorrections || correctedResume) && (
                  <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardHeader>
                      <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        {isGeneratingCorrections ? 'Generating ATS-Optimized Resume...' : 'ATS-Optimized Resume Ready!'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isGeneratingCorrections ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                          <p className="text-sm text-green-600 dark:text-green-400">
                            AI is automatically correcting your resume for maximum ATS compatibility...
                          </p>
                        </div>
                      ) : correctedResume ? (
                        <div className="space-y-4">
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Your ATS-optimized resume has been generated and is ready for download as PDF!
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Button
                              onClick={downloadCorrectedResumeAsPDF}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                            
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(correctedResume);
                                toast({
                                  title: "Copied to Clipboard",
                                  description: "The optimized resume has been copied.",
                                });
                              }}
                              variant="outline"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Text
                            </Button>
                            
                            <Button
                              onClick={() => handleGenerateCorrections()}
                              variant="ghost"
                              disabled={isGeneratingCorrections}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )}

                {/* Manual Correction Button */}
                {!correctedResume && !isGeneratingCorrections && (
                  <Button
                    onClick={() => handleGenerateCorrections()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate ATS-Optimized Resume
                  </Button>
                )}

                {/* Analysis Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Missing Keywords */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5" />
                      Missing Keywords ({analysis.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Matching Job Roles */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Target className="w-5 h-5" />
                      Matching Roles ({analysis.matchingJobRoles.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {analysis.matchingJobRoles.map((role, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-5 h-5" />
                      Format Suggestions
                    </h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {analysis.formatSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      Recommended Improvements
                    </h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="space-y-4">
                  <Brain className="w-20 h-20 mx-auto opacity-30" />
                  <div>
                    <p className="text-xl font-medium">Ready for AI Analysis</p>
                    <p className="text-sm mt-2">Upload your resume (PDF, DOC, DOCX, TXT) and get instant analysis with automatic corrections</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Corrected Resume Preview */}
        {correctedResume && (
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                Your ATS-Optimized Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm bg-white/50 dark:bg-black/20 p-4 rounded-lg border max-h-96 overflow-y-auto font-sans">{correctedResume}</pre>
                  </div>
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
