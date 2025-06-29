import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generateColdEmail } from '../services/geminiApi';

interface EmailFormData {
  recipientName: string;
  recipientEmail: string;
  recipientCompany: string;
  recipientRole: string;
  senderName: string;
  senderEmail: string;
  jobTitle: string;
  experience: string;
  skills: string;
  personalNote: string;
}

const ColdEmailGenerator = () => {
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EmailFormData>({
    defaultValues: {
      recipientName: '',
      recipientEmail: '',
      recipientCompany: '',
      recipientRole: '',
      senderName: '',
      senderEmail: '',
      jobTitle: '',
      experience: '',
      skills: '',
      personalNote: ''
    }
  });

  const formData = watch();

  const onGenerate = async (data: EmailFormData) => {
    if (!data.recipientName || !data.senderName || !data.jobTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional cold email for a job application with the following details:
      
      Recipient: ${data.recipientName} (${data.recipientRole || 'Hiring Manager'}) at ${data.recipientCompany || 'the company'}
      Sender: ${data.senderName}
      Job Interest: ${data.jobTitle}
      Experience: ${data.experience || 'Not specified'}
      Skills: ${data.skills || 'Not specified'}
      Personal Note: ${data.personalNote || 'None'}
      
      Make the email:
      - Professional and concise
      - Personalized to the recipient and company
      - Highlight relevant experience and skills
      - Include a clear call to action
      - Be engaging but not overly familiar
      - Keep it under 200 words
      
      Do not include subject line, just the email body starting with the greeting.`;

      const email = await generateColdEmail(prompt);
      setGeneratedEmail(email);
      toast.success('Email generated successfully!');
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail);
      toast.success('Email copied to clipboard!');
    }
  };

  const sendEmail = () => {
    if (!formData.recipientEmail || !formData.senderEmail) {
      toast.error('Please provide both sender and recipient email addresses');
      return;
    }

    setIsSending(true);
    
    // Create Gmail compose URL
    const subject = `Application for ${formData.jobTitle} Position`;
    const body = generatedEmail;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(formData.recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail in a new tab
    window.open(gmailUrl, '_blank');
    
    setTimeout(() => {
      setIsSending(false);
      toast.success('Gmail opened successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Details
            </CardTitle>
            <CardDescription>
              Fill in the details to generate a personalized cold email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Recipient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name *</Label>
                    <Input
                      id="recipientName"
                      {...register('recipientName', { required: 'Recipient name is required' })}
                      placeholder="John Smith"
                    />
                    {errors.recipientName && (
                      <p className="text-sm text-destructive">{errors.recipientName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      {...register('recipientEmail')}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientCompany">Company</Label>
                    <Input
                      id="recipientCompany"
                      {...register('recipientCompany')}
                      placeholder="Tech Corp Inc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientRole">Their Role</Label>
                    <Input
                      id="recipientRole"
                      {...register('recipientRole')}
                      placeholder="Hiring Manager"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Your Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Your Name *</Label>
                    <Input
                      id="senderName"
                      {...register('senderName', { required: 'Your name is required' })}
                      placeholder="Jane Doe"
                    />
                    {errors.senderName && (
                      <p className="text-sm text-destructive">{errors.senderName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Your Email</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      {...register('senderEmail')}
                      placeholder="jane@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title You're Interested In *</Label>
                  <Input
                    id="jobTitle"
                    {...register('jobTitle', { required: 'Job title is required' })}
                    placeholder="Software Engineer"
                  />
                  {errors.jobTitle && (
                    <p className="text-sm text-destructive">{errors.jobTitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Your Experience</Label>
                  <Textarea
                    id="experience"
                    {...register('experience')}
                    placeholder="5 years of experience in React, Node.js..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills</Label>
                  <Textarea
                    id="skills"
                    {...register('skills')}
                    placeholder="JavaScript, Python, AWS, Leadership..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalNote">Personal Note (Optional)</Label>
                  <Textarea
                    id="personalNote"
                    {...register('personalNote')}
                    placeholder="Any specific reason for reaching out or connection to the company..."
                    rows={2}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Email */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
            <CardDescription>
              Your personalized cold email will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedEmail ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedEmail}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  
                  <Button 
                    onClick={sendEmail}
                    size="sm"
                    className="flex-1"
                    disabled={isSending || !formData.recipientEmail}
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send via Gmail
                      </>
                    )}
                  </Button>
                </div>

                {!formData.recipientEmail && (
                  <p className="text-sm text-muted-foreground text-center">
                    Add recipient email to enable sending
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the form and click "Generate Email" to create your personalized cold email</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColdEmailGenerator;
