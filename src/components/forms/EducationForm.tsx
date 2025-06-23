
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from '../../types/resumeTypes';

interface EducationFormProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
}

const EducationForm = ({ register, control }: EducationFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ degree: '', institution: '', year: '' })}
        >
          Add Education
        </Button>
      </div>
      {fields.map((field, index) => (
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

export default EducationForm;
