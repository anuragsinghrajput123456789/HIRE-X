
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import BasicInfoForm from './forms/BasicInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';
import { FormData, ResumeData } from '../types/resumeTypes';

const ResumeGenerator = ({ onResumeGenerated }: { onResumeGenerated: (resume: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState('');
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

      const resume = await generateResume(processedData);
      setGeneratedResume(resume);
      onResumeGenerated(resume);
      
      toast({
        title: "Resume Generated Successfully!",
        description: "Your AI-powered resume is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
              {isGenerating ? 'Generating Resume...' : 'Generate AI Resume'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">Generated Resume</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedResume ? (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{generatedResume}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg">Your AI-generated resume will appear here</p>
              <p className="text-sm mt-2">Fill out the form and click "Generate AI Resume" to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeGenerator;
