
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormData } from '../../types/resumeTypes';

interface AdditionalInfoFormProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
}

const AdditionalInfoForm = ({ register, control }: AdditionalInfoFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects'
  });

  return (
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Projects</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', description: '', technologies: '' })}
          >
            Add Project
          </Button>
        </div>
        {fields.map((field, index) => (
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
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
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
  );
};

export default AdditionalInfoForm;
