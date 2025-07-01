
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Sparkles, Bot, Copy, Eye } from 'lucide-react';
import BasicInfoForm from './forms/BasicInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';
import CustomSectionsForm from './forms/CustomSectionsForm';
import { FormData, ResumeData } from '../types/resumeTypes';
import html2pdf from 'html2pdf.js';

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

const ResumeGenerator = ({ onResumeGenerated }: { onResumeGenerated: (resume: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<ResumeData | null>(null);
  const [atsOptimizedContent, setAtsOptimizedContent] = useState<string>('');
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const { toast } = useToast();

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      skills: '',
      education: [{ degree: '', institution: '', year: '' }],
      experience: [{ company: '', role: '', duration: '', description: '' }],
      certifications: '',
      projects: [{ name: '', description: '', technologies: '' }],
      languages: '',
      achievements: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      const processedData: ResumeData = {
        ...data,
        skills: data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
        certifications: data.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0),
        languages: data.languages ? data.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        achievements: data.achievements ? data.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
      };

      // Generate ATS-optimized content using AI
      const atsContent = await generateResume(processedData);
      setAtsOptimizedContent(atsContent);
      setGeneratedData(processedData);
      onResumeGenerated('ATS-Optimized Resume Generated');
      
      toast({
        title: "✅ ATS-Optimized Resume Generated!",
        description: "Your professional resume is ready with enhanced formatting and keyword optimization.",
      });
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!generatedData) return;

    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${generatedData.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        allowTaint: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    html2pdf().set(opt).from(resumeElement).save().then(() => {
      toast({
        title: "📄 Resume Downloaded Successfully!",
        description: "Your ATS-optimized PDF resume is ready to use.",
      });
    });
  };

  const copyToClipboard = () => {
    if (atsOptimizedContent) {
      navigator.clipboard.writeText(atsOptimizedContent);
      toast({
        title: "📋 Copied to Clipboard",
        description: "Resume content copied successfully!",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <Card className="h-fit shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="gradient-text flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            AI Resume Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create professional, ATS-optimized resumes with AI-powered content enhancement
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoForm register={register} errors={errors} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <EducationForm register={register} control={control} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <ExperienceForm register={register} control={control} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <AdditionalInfoForm register={register} control={control} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <CustomSectionsForm 
              customSections={customSections}
              onSectionsChange={setCustomSections}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl py-4 rounded-xl text-lg font-semibold"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating ATS-Optimized Resume...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Perfect ATS Resume</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="gradient-text flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            ATS-Optimized Preview
          </CardTitle>
          {generatedData && (
            <div className="flex gap-2">
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Copy size={16} />
                Copy Text
              </Button>
              <Button 
                onClick={downloadPDF} 
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all"
                size="sm"
              >
                <Download size={16} />
                Download PDF
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {generatedData ? (
            <div className="max-h-[800px] overflow-y-auto">
              <div id="resume-preview" className="bg-white text-black p-8 font-['Arial',sans-serif] leading-normal">
                {/* ATS-Optimized Header */}
                <div className="text-center mb-6 pb-4" style={{ borderBottom: '3px solid #000' }}>
                  <h1 className="text-3xl font-bold text-black mb-3 tracking-wide uppercase" style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    {generatedData.fullName}
                  </h1>
                  <div className="flex justify-center items-center gap-4 text-sm text-gray-800 flex-wrap">
                    <span className="font-medium">{generatedData.phone}</span>
                    <span className="text-gray-600">•</span>
                    <span className="font-medium">{generatedData.email}</span>
                    {generatedData.linkedin && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="font-medium">LinkedIn: {generatedData.linkedin}</span>
                      </>
                    )}
                    {generatedData.github && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="font-medium">GitHub: {generatedData.github}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {generatedData.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '16px' }}>
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-900 text-justify" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      {generatedData.summary}
                    </p>
                  </div>
                )}

                {/* Core Competencies */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '16px' }}>
                    CORE COMPETENCIES
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {generatedData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center" style={{ fontSize: '11px' }}>
                        <span className="w-1 h-1 bg-black rounded-full mr-2"></span>
                        <span className="font-medium text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Experience */}
                {generatedData.experience.length > 0 && generatedData.experience[0].company && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '16px' }}>
                      PROFESSIONAL EXPERIENCE
                    </h2>
                    {generatedData.experience.map((exp, index) => (
                      <div key={index} className="mb-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-base text-black" style={{ fontSize: '13px' }}>{exp.role}</h3>
                            <p className="font-semibold text-gray-800" style={{ fontSize: '12px' }}>{exp.company}</p>
                          </div>
                          <span className="text-sm font-medium bg-gray-200 px-3 py-1 rounded" style={{ fontSize: '10px' }}>
                            {exp.duration}
                          </span>
                        </div>
                        <div className="ml-4 text-gray-900" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                          {exp.description.split(/[.!]/).filter(item => item.trim()).map((item, idx) => (
                            <div key={idx} className="flex items-start mb-1">
                              <span className="mr-2 mt-1.5">•</span>
                              <span>{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '16px' }}>
                    EDUCATION
                  </h2>
                  {generatedData.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-black" style={{ fontSize: '12px' }}>{edu.degree}</h3>
                          <p className="font-medium text-gray-800" style={{ fontSize: '11px' }}>{edu.institution}</p>
                        </div>
                        <span className="text-sm font-medium bg-gray-200 px-3 py-1 rounded" style={{ fontSize: '10px' }}>
                          {edu.year}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-gray-700 mt-1" style={{ fontSize: '10px' }}>GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Projects */}
                {generatedData.projects.length > 0 && generatedData.projects[0].name && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '16px' }}>
                      KEY PROJECTS
                    </h2>
                    {generatedData.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-black" style={{ fontSize: '12px' }}>{project.name}</h3>
                          <span className="text-xs italic bg-gray-200 px-2 py-1 rounded" style={{ fontSize: '9px' }}>
                            {project.technologies}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 leading-relaxed ml-4" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                          • {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Two-column layout for additional sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Certifications */}
                  {generatedData.certifications.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-black mb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
                        CERTIFICATIONS
                      </h2>
                      <div className="space-y-1">
                        {generatedData.certifications.map((cert, index) => (
                          <div key={index} className="flex items-start" style={{ fontSize: '11px' }}>
                            <span className="mr-2 mt-1">•</span>
                            <span className="text-gray-900">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {generatedData.languages && generatedData.languages.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-black mb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
                        LANGUAGES
                      </h2>
                      <div className="space-y-1">
                        {generatedData.languages.map((lang, index) => (
                          <div key={index} className="flex items-start" style={{ fontSize: '11px' }}>
                            <span className="mr-2 mt-1">•</span>
                            <span className="text-gray-900">{lang}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {generatedData.achievements && generatedData.achievements.length > 0 && (
                    <div className="md:col-span-2">
                      <h2 className="text-base font-bold text-black mb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #333', paddingBottom: '2px', fontSize: '14px' }}>
                        KEY ACHIEVEMENTS
                      </h2>
                      <div className="space-y-1">
                        {generatedData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start" style={{ fontSize: '11px' }}>
                            <span className="mr-2 mt-1">•</span>
                            <span className="text-gray-900">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Sections */}
                {customSections.length > 0 && (
                  <div className="mt-6 space-y-6">
                    {customSections.map((section) => (
                      <div key={section.id}>
                        <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide" style={{ borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '16px' }}>
                          {section.title}
                        </h2>
                        <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap ml-4" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                          {section.content.split('\n').map((line, idx) => (
                            <div key={idx} className="flex items-start mb-1">
                              {line.trim() && <span className="mr-2 mt-1">•</span>}
                              <span>{line.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-20 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                  <FileText size={64} className="text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse">
                  <Sparkles size={24} className="text-white" />
                </div>
              </div>
              <div className="space-y-3 max-w-md">
                <h3 className="text-2xl font-bold gradient-text">AI-Powered Resume Creator</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Fill out the form and click "Generate Perfect ATS Resume" to create a 
                  professional, keyword-optimized resume that passes through ATS systems 
                  and catches recruiters' attention.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>ATS-Friendly</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={16} />
                    <span>AI-Enhanced</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download size={16} />
                    <span>PDF Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeGenerator;
