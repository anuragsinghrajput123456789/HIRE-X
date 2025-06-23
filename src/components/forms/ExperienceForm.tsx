
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormData } from '../../types/resumeTypes';

interface ExperienceFormProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
}

const ExperienceForm = ({ register, control }: ExperienceFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ company: '', role: '', duration: '', description: '' })}
        >
          Add Experience
        </Button>
      </div>
      {fields.map((field, index) => (
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
  );
};

export default ExperienceForm;
