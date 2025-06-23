
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface PDFExportProps {
  content: string;
  filename?: string;
  elementId?: string;
}

const PDFExport = ({ content, filename = 'resume', elementId = 'resume-preview' }: PDFExportProps) => {
  const { toast } = useToast();

  const exportToPDF = async () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please generate a resume first before exporting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast({
          title: "Export Failed",
          description: "Resume preview not found. Please generate a resume first.",
          variant: "destructive",
        });
        return;
      }

      const opt = {
        margin: 0.5,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "PDF Downloaded",
        description: "Your resume has been exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={exportToPDF}
      variant="outline"
      disabled={!content.trim()}
      className="flex items-center gap-2"
    >
      <Download size={16} />
      Export PDF
    </Button>
  );
};

export default PDFExport;
