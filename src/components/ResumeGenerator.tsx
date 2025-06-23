
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText } from 'lucide-react';
import BasicInfoForm from './forms/BasicInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';
import { FormData, ResumeData } from '../types/resumeTypes';
import html2pdf from 'html2pdf.js';

const ResumeGenerator = ({ onResumeGenerated }: { onResumeGenerated: (resume: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<ResumeData | null>(null);
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

      setGeneratedData(processedData);
      onResumeGenerated('Resume Generated');
      
      toast({
        title: "Resume Generated Successfully!",
        description: "Your professional resume is ready for download.",
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
      filename: `${generatedData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(resumeElement).save();
    
    toast({
      title: "PDF Downloaded",
      description: "Your resume has been downloaded successfully!",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="gradient-text">Resume Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoForm register={register} errors={errors} />
            <Separator />
            <EducationForm register={register} control={control} />
            <Separator />
            <ExperienceForm register={register} control={control} />
            <Separator />
            <AdditionalInfoForm register={register} control={control} />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Resume...' : 'Generate Professional Resume'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="gradient-text">Resume Preview</CardTitle>
          {generatedData && (
            <Button onClick={downloadPDF} className="flex items-center gap-2">
              <Download size={16} />
              Download PDF
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {generatedData ? (
            <div id="resume-preview" className="bg-white text-black p-8 min-h-[800px] shadow-lg">
              {/* Header Section */}
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{generatedData.fullName}</h1>
                <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                  <span>{generatedData.phone}</span>
                  <span>|</span>
                  <span>{generatedData.email}</span>
                  {generatedData.linkedin && (
                    <>
                      <span>|</span>
                      <span>LinkedIn</span>
                    </>
                  )}
                  {generatedData.github && (
                    <>
                      <span>|</span>
                      <span>GitHub</span>
                    </>
                  )}
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 border-b border-gray-400 mb-3">EDUCATION</h2>
                {generatedData.education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.institution}</p>
                      </div>
                      <span className="text-sm font-medium">{edu.year}</span>
                    </div>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 border-b border-gray-400 mb-3">SKILLS</h2>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Programming Languages: </span>
                    <span>{generatedData.skills.filter(skill => 
                      ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin'].some(lang => 
                        skill.toLowerCase().includes(lang)
                      )
                    ).join(', ') || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Web Development Technologies: </span>
                    <span>{generatedData.skills.filter(skill => 
                      ['html', 'css', 'react', 'vue', 'angular', 'node', 'express', 'bootstrap', 'tailwind'].some(tech => 
                        skill.toLowerCase().includes(tech)
                      )
                    ).join(', ') || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Tools & Platforms: </span>
                    <span>{generatedData.skills.filter(skill => 
                      ['git', 'docker', 'aws', 'azure', 'mongodb', 'mysql', 'postgresql'].some(tool => 
                        skill.toLowerCase().includes(tool)
                      )
                    ).join(', ') || generatedData.skills.slice(0, 5).join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              {generatedData.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 border-b border-gray-400 mb-3">PROJECTS</h2>
                  {generatedData.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold">{project.name}</h3>
                        <span className="text-sm italic">{project.technologies}</span>
                      </div>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li>{project.description}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience Section */}
              {generatedData.experience.length > 0 && generatedData.experience[0].company && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 border-b border-gray-400 mb-3">EXPERIENCE</h2>
                  {generatedData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold">{exp.role}</h3>
                          <p className="text-gray-700">{exp.company}</p>
                        </div>
                        <span className="text-sm font-medium">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li>{exp.description}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Additional Sections */}
              {generatedData.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 border-b border-gray-400 mb-3">CERTIFICATIONS</h2>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    {generatedData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedData.languages && generatedData.languages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 border-b border-gray-400 mb-3">LANGUAGES</h2>
                  <p className="text-sm">{generatedData.languages.join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
              <FileText size={48} className="text-gray-400" />
              <p className="text-lg">Your professional resume will appear here</p>
              <p className="text-sm">Fill out the form and click "Generate Professional Resume" to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeGenerator;
