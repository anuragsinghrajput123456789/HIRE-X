
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Copy, RefreshCw, User, Building, Briefcase, Sparkles } from 'lucide-react';
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
    
    const subject = `Application for ${formData.jobTitle} Position`;
    const body = generatedEmail;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(formData.recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank');
    
    setTimeout(() => {
      setIsSending(false);
      toast.success('Gmail opened successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 min-h-screen p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-gradient-to-br from-gray-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-t-lg border-b border-slate-700/50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                Email Configuration
              </span>
            </CardTitle>
            <CardDescription className="text-gray-300 font-medium">
              Provide details to create your personalized cold email
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
              {/* Recipient Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-200 uppercase tracking-wide text-sm">Recipient Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-sm font-semibold text-gray-300">
                      Recipient Name *
                    </Label>
                    <Input
                      id="recipientName"
                      {...register('recipientName', { required: 'Recipient name is required' })}
                      placeholder="John Smith"
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                    {errors.recipientName && (
                      <p className="text-sm text-red-400 font-medium">{errors.recipientName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail" className="text-sm font-semibold text-gray-300">
                      Recipient Email
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      {...register('recipientEmail')}
                      placeholder="john@company.com"
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientCompany" className="text-sm font-semibold text-gray-300">
                      Company
                    </Label>
                    <Input
                      id="recipientCompany"
                      {...register('recipientCompany')}
                      placeholder="Tech Corp Inc."
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientRole" className="text-sm font-semibold text-gray-300">
                      Their Role
                    </Label>
                    <Input
                      id="recipientRole"
                      {...register('recipientRole')}
                      placeholder="Hiring Manager"
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-slate-700 to-slate-600" />

              {/* Sender Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-200 uppercase tracking-wide text-sm">Your Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName" className="text-sm font-semibold text-gray-300">
                      Your Name *
                    </Label>
                    <Input
                      id="senderName"
                      {...register('senderName', { required: 'Your name is required' })}
                      placeholder="Jane Doe"
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                    {errors.senderName && (
                      <p className="text-sm text-red-400 font-medium">{errors.senderName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail" className="text-sm font-semibold text-gray-300">
                      Your Email
                    </Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      {...register('senderEmail')}
                      placeholder="jane@email.com"
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-300">
                    Job Title You're Interested In *
                  </Label>
                  <Input
                    id="jobTitle"
                    {...register('jobTitle', { required: 'Job title is required' })}
                    placeholder="Software Engineer"
                    className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                  />
                  {errors.jobTitle && (
                    <p className="text-sm text-red-400 font-medium">{errors.jobTitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-semibold text-gray-300">
                    Your Experience
                  </Label>
                  <Textarea
                    id="experience"
                    {...register('experience')}
                    placeholder="5 years of experience in React, Node.js..."
                    rows={3}
                    className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 resize-none text-gray-100 placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-semibold text-gray-300">
                    Key Skills
                  </Label>
                  <Textarea
                    id="skills"
                    {...register('skills')}
                    placeholder="JavaScript, Python, AWS, Leadership..."
                    rows={2}
                    className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 resize-none text-gray-100 placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalNote" className="text-sm font-semibold text-gray-300">
                    Personal Note (Optional)
                  </Label>
                  <Textarea
                    id="personalNote"
                    {...register('personalNote')}
                    placeholder="Any specific reason for reaching out or connection to the company..."
                    rows={2}
                    className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 resize-none text-gray-100 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-3"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Crafting Your Email...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Perfect Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Email */}
        <Card className="bg-gradient-to-br from-gray-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-t-lg border-b border-slate-700/50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
                Generated Email
              </span>
            </CardTitle>
            <CardDescription className="text-gray-300 font-medium">
              Your AI-crafted personalized cold email
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {generatedEmail ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-700/50 to-slate-800/50 p-6 rounded-xl border border-slate-600/50 shadow-inner">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 font-medium">
                    {generatedEmail}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline" 
                    className="flex-1 border-slate-600 text-gray-200 hover:bg-gray-700/50 hover:border-green-400 transition-all duration-300 font-semibold"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                  
                  <Button 
                    onClick={sendEmail}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    disabled={isSending || !formData.recipientEmail}
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Opening Gmail...
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
                  <div className="text-center p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                    <p className="text-sm text-amber-300 font-medium">
                      💡 Add recipient email to enable direct sending
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-700/50 to-slate-800/50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Mail className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Ready to Generate</h3>
                <p className="text-gray-400 font-medium">
                  Fill in the form and click "Generate Perfect Email" to create your personalized outreach
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColdEmailGenerator;
