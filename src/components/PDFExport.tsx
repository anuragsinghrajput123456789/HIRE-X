
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

interface PDFExportProps {
  content: string;
  filename?: string;
}

const PDFExport = ({ content, filename = 'resume' }: PDFExportProps) => {
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
      // Create a temporary div with the content
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
          ${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}
        </div>
      `;

      const opt = {
        margin: 1,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
    >
      📄 Export PDF
    </Button>
  );
};

export default PDFExport;
