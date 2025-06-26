import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Sparkles, Bot } from 'lucide-react';
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
        title: "ATS-Optimized Resume Generated!",
        description: "Your professional, ATS-friendly resume is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
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
      margin: 0.5,
      filename: `${generatedData.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(resumeElement).save();
    
    toast({
      title: "ATS Resume Downloaded",
      description: "Your ATS-optimized resume has been downloaded successfully!",
    });
  };

  const copyToClipboard = () => {
    if (atsOptimizedContent) {
      navigator.clipboard.writeText(atsOptimizedContent);
      toast({
        title: "Copied to Clipboard",
        description: "Resume content copied to clipboard!",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card className="h-fit shadow-lg hover-scale">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="gradient-text flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Resume Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create ATS-optimized resumes powered by AI
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoForm register={register} errors={errors} />
            <Separator />
            <EducationForm register={register} control={control} />
            <Separator />
            <ExperienceForm register={register} control={control} />
            <Separator />
            <AdditionalInfoForm register={register} control={control} />
            <Separator />
            <CustomSectionsForm 
              customSections={customSections}
              onSectionsChange={setCustomSections}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating ATS Resume...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate ATS-Optimized Resume
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="gradient-text flex items-center gap-2">
            <FileText className="w-5 h-5" />
            ATS-Optimized Preview
          </CardTitle>
          {generatedData && (
            <div className="flex gap-2">
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 hover-scale"
              >
                📋 Copy
              </Button>
              <Button 
                onClick={downloadPDF} 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
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
              <div id="resume-preview" className="bg-white text-black p-8 shadow-inner">
                {/* ATS-Optimized Header */}
                <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide">
                    {generatedData.fullName.toUpperCase()}
                  </h1>
                  <div className="flex justify-center items-center gap-3 text-sm text-gray-700 flex-wrap">
                    <span className="font-medium">{generatedData.phone}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{generatedData.email}</span>
                    {generatedData.linkedin && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">LinkedIn Profile</span>
                      </>
                    )}
                    {generatedData.github && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">GitHub Portfolio</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {generatedData.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 mb-3 uppercase tracking-wide">
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-800">{generatedData.summary}</p>
                  </div>
                )}

                {/* Core Competencies (ATS-friendly skills section) */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 mb-3 uppercase tracking-wide">
                    CORE COMPETENCIES
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm">
                    {generatedData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        <span className="font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Experience */}
                {generatedData.experience.length > 0 && generatedData.experience[0].company && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 mb-3 uppercase tracking-wide">
                      PROFESSIONAL EXPERIENCE
                    </h2>
                    {generatedData.experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-base">{exp.role}</h3>
                            <p className="font-semibold text-gray-700">{exp.company}</p>
                          </div>
                          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                            {exp.duration}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4 text-gray-800">
                          {exp.description.split('.').filter(item => item.trim()).map((item, idx) => (
                            <li key={idx}>{item.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 mb-3 uppercase tracking-wide">
                    EDUCATION
                  </h2>
                  {generatedData.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{edu.degree}</h3>
                          <p className="font-medium text-gray-700">{edu.institution}</p>
                        </div>
                        <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                          {edu.year}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Projects */}
                {generatedData.projects.length > 0 && generatedData.projects[0].name && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 mb-3 uppercase tracking-wide">
                      KEY PROJECTS
                    </h2>
                    {generatedData.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold">{project.name}</h3>
                          <span className="text-xs italic bg-gray-100 px-2 py-1 rounded">
                            {project.technologies}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">{project.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Additional Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedData.certifications.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-gray-900 border-b border-gray-300 mb-2 uppercase tracking-wide">
                        CERTIFICATIONS
                      </h2>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-800">
                        {generatedData.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedData.languages && generatedData.languages.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-gray-900 border-b border-gray-300 mb-2 uppercase tracking-wide">
                        LANGUAGES
                      </h2>
                      <p className="text-sm text-gray-800">{generatedData.languages.join(' • ')}</p>
                    </div>
                  )}
                </div>

                {/* Custom Sections */}
                {customSections.length > 0 && (
                  <div className="space-y-6">
                    {customSections.map((section) => (
                      <div key={section.id} className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 mb-3 uppercase tracking-wide">
                          {section.title}
                        </h2>
                        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4">
              <div className="relative">
                <FileText size={64} className="text-gray-300" />
                <Sparkles size={24} className="absolute -top-2 -right-2 text-blue-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold">AI-Powered Resume Generator</p>
                <p className="text-sm max-w-md">
                  Fill out the form and click "Generate ATS-Optimized Resume" to create a 
                  professional, keyword-optimized resume that passes ATS systems
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeGenerator;
