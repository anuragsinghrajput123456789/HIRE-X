
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { generateResume, type ResumeData } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

const ResumeGenerator = ({ onResumeGenerated }: { onResumeGenerated: (resume: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState('');
  const { toast } = useToast();

  const { register, control, handleSubmit, formState: { errors } } = useForm<ResumeData>({
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

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  });

  const onSubmit = async (data: ResumeData) => {
    setIsGenerating(true);
    try {
      // Process array fields - convert strings to arrays
      const processedData: ResumeData = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : (data.skills as string).split(',').map(s => s.trim()),
        certifications: Array.isArray(data.certifications) ? data.certifications : (data.certifications as string).split(',').map(s => s.trim()),
        languages: Array.isArray(data.languages) ? data.languages : data.languages ? (data.languages as string).split(',').map(s => s.trim()) : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : data.achievements ? (data.achievements as string).split(',').map(s => s.trim()) : []
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
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName', { required: 'Full name is required' })}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    {...register('phone', { required: 'Phone is required' })}
                    placeholder="+1-234-567-8900"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="jobRole">Target Job Role *</Label>
                  <Input
                    id="jobRole"
                    {...register('jobRole', { required: 'Job role is required' })}
                    placeholder="Software Engineer"
                  />
                  {errors.jobRole && <p className="text-red-500 text-sm">{errors.jobRole.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    {...register('linkedin')}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    {...register('github')}
                    placeholder="github.com/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio</Label>
                  <Input
                    id="portfolio"
                    {...register('portfolio')}
                    placeholder="johndoe.dev"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  {...register('summary')}
                  placeholder="Brief professional summary..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills * (comma-separated)</Label>
                <Textarea
                  id="skills"
                  {...register('skills', { required: 'Skills are required' })}
                  placeholder="JavaScript, React, Node.js, Python, AWS"
                  rows={2}
                />
                {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}
              </div>
            </div>

            <Separator />

            {/* Education */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Education</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendEducation({ degree: '', institution: '', year: '' })}
                >
                  Add Education
                </Button>
              </div>
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        {...register(`education.${index}.degree` as const)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        {...register(`education.${index}.institution` as const)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        {...register(`education.${index}.year` as const)}
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <Label>GPA (optional)</Label>
                      <Input
                        {...register(`education.${index}.gpa` as const)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                  {educationFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendExperience({ company: '', role: '', duration: '', description: '' })}
                >
                  Add Experience
                </Button>
              </div>
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company</Label>
                      <Input
                        {...register(`experience.${index}.company` as const)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        {...register(`experience.${index}.role` as const)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Duration</Label>
                      <Input
                        {...register(`experience.${index}.duration` as const)}
                        placeholder="Jan 2021 - Present"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        {...register(`experience.${index}.description` as const)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                  {experienceFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                <Textarea
                  id="certifications"
                  {...register('certifications')}
                  placeholder="AWS Certified Developer, Google Analytics Certified"
                  rows={2}
                />
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Projects</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendProject({ name: '', description: '', technologies: '' })}
                  >
                    Add Project
                  </Button>
                </div>
                {projectFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-2">
                    <div>
                      <Label>Project Name</Label>
                      <Input
                        {...register(`projects.${index}.name` as const)}
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        {...register(`projects.${index}.description` as const)}
                        placeholder="Built a full-stack e-commerce platform..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Technologies</Label>
                      <Input
                        {...register(`projects.${index}.technologies` as const)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    {projectFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    {...register('languages')}
                    placeholder="English, Spanish, French"
                  />
                </div>
                <div>
                  <Label htmlFor="achievements">Achievements (comma-separated)</Label>
                  <Input
                    id="achievements"
                    {...register('achievements')}
                    placeholder="Dean's List, Hackathon Winner"
                  />
                </div>
              </div>
            </div>

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

      {/* Generated Resume Preview */}
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
