
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormData } from '../../types/resumeTypes';

interface BasicInfoFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const BasicInfoForm = ({ register, errors }: BasicInfoFormProps) => {
  return (
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
  );
};

export default BasicInfoForm;
