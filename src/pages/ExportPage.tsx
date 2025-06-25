
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExportPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Export Resume</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Export functionality has been moved to individual generators for better user experience
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">Export Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              You can now export your resumes directly from:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Resume Generator</h3>
                <p className="text-sm text-muted-foreground">
                  Generate and download ATS-friendly resumes
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Resume Analyzer</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze and download improved resume versions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;
