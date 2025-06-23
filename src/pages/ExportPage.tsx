
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PDFExport from '../components/PDFExport';

const ExportPage = () => {
  const [generatedResume, setGeneratedResume] = useState('');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Export Resume</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Export your AI-generated resume in various formats
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Export your AI-generated resume in various formats for different applications.
            </p>
            <div className="flex flex-wrap gap-4">
              <PDFExport content={generatedResume} filename="resume" />
              <button 
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
                onClick={() => {
                  if (generatedResume) {
                    navigator.clipboard.writeText(generatedResume);
                  }
                }}
              >
                📋 Copy Text
              </button>
            </div>
            {generatedResume && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Preview:</h4>
                <div className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                  {generatedResume.substring(0, 300)}...
                </div>
              </div>
            )}
            {!generatedResume && (
              <div className="text-center text-muted-foreground py-8">
                <p>No resume generated yet. Visit the Generator page to create one first.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;
