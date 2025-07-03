import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

export default function FileUpload({ onFileContent }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a TXT, PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    
    // For now, only handle text files
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileContent(content);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "File processing not implemented",
        description: "Currently only text files are supported. Please paste your text directly.",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onFileContent('');
  };

  return (
    <div className="mb-6">
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary bg-blue-50'
              : 'border-gray-300 hover:border-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <Upload className="mx-auto text-gray-400 text-3xl mb-3" />
          <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
          <p className="text-sm text-gray-500">Supports: DOC, DOCX, PDF, TXT (Max 50MB)</p>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".doc,.docx,.pdf,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="text-primary mr-2" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
