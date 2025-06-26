import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface CustomSectionsFormProps {
  customSections: CustomSection[];
  onSectionsChange: (sections: CustomSection[]) => void;
}

const CustomSectionsForm = ({ customSections, onSectionsChange }: CustomSectionsFormProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({ title: '', content: '' });

  const addSection = () => {
    if (newSection.title.trim() && newSection.content.trim()) {
      const section: CustomSection = {
        id: Date.now().toString(),
        title: newSection.title,
        content: newSection.content
      };
      onSectionsChange([...customSections, section]);
      setNewSection({ title: '', content: '' });
    }
  };

  const deleteSection = (id: string) => {
    onSectionsChange(customSections.filter(section => section.id !== id));
  };

  const updateSection = (id: string, title: string, content: string) => {
    onSectionsChange(
      customSections.map(section =>
        section.id === id ? { ...section, title, content } : section
      )
    );
    setEditingId(null);
  };

  const startEditing = (id: string) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Custom Sections</h3>
        <span className="text-sm text-muted-foreground">
          Add your own sections to the resume
        </span>
      </div>

      {/* Add New Section */}
      <Card className="border-dashed border-2 border-blue-300 hover:border-blue-400 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="new-section-title">Section Title</Label>
            <Input
              id="new-section-title"
              value={newSection.title}
              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              placeholder="e.g., Volunteer Experience, Publications, Awards"
            />
          </div>
          <div>
            <Label htmlFor="new-section-content">Content</Label>
            <Textarea
              id="new-section-content"
              value={newSection.content}
              onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
              placeholder="Describe the content for this section..."
              rows={3}
            />
          </div>
          <Button 
            onClick={addSection} 
            className="w-full"
            disabled={!newSection.title.trim() || !newSection.content.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </CardContent>
      </Card>

      {/* Existing Sections */}
      {customSections.map((section) => (
        <Card key={section.id} className="relative">
          <CardHeader className="pb-3">
            {editingId === section.id ? (
              <div className="space-y-2">
                <Input
                  defaultValue={section.title}
                  onBlur={(e) => {
                    const content = customSections.find(s => s.id === section.id)?.content || '';
                    updateSection(section.id, e.target.value, content);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const content = customSections.find(s => s.id === section.id)?.content || '';
                      updateSection(section.id, e.currentTarget.value, content);
                    }
                  }}
                  className="font-semibold"
                />
              </div>
            ) : (
              <CardTitle className="text-base flex items-center justify-between">
                {section.title}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(section.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSection(section.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {editingId === section.id ? (
              <div className="space-y-3">
                <Textarea
                  defaultValue={section.content}
                  onBlur={(e) => {
                    updateSection(section.id, section.title, e.target.value);
                  }}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const titleInput = document.querySelector(`input[value="${section.title}"]`) as HTMLInputElement;
                      const contentTextarea = document.querySelector(`textarea`) as HTMLTextAreaElement;
                      if (titleInput && contentTextarea) {
                        updateSection(section.id, titleInput.value, contentTextarea.value);
                      }
                    }}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEditing}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {section.content}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {customSections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No custom sections added yet</p>
          <p className="text-sm">Add sections like Awards, Publications, or Volunteer Work</p>
        </div>
      )}
    </div>
  );
};

export default CustomSectionsForm;
