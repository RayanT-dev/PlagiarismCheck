import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import FileUpload from "./file-upload";
import { AnalysisOptions } from "@/lib/types";

interface TextInputProps {
  content: string;
  onContentChange: (content: string) => void;
  options: AnalysisOptions;
  onOptionsChange: (options: AnalysisOptions) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function TextInput({
  content,
  onContentChange,
  options,
  onOptionsChange,
  onAnalyze,
  isAnalyzing
}: TextInputProps) {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characterCount = content.length;

  const handleOptionChange = (option: keyof AnalysisOptions, value: boolean) => {
    onOptionsChange({
      ...options,
      [option]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Submit Content for Analysis</h2>
      


      <div className="mb-6">
        <Label htmlFor="contentInput" className="text-sm font-medium text-gray-700 mb-2">
          Paste your text here
        </Label>
        <Textarea
          id="contentInput"
          rows={12}
          className="w-full mt-2 resize-none"
          placeholder="Enter or paste your content here for plagiarism analysis..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">{wordCount} words</span>
          <span className="text-sm text-gray-500">{characterCount} characters</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Analysis Options</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkSimilarity"
              checked={options.checkSimilarity}
              onCheckedChange={(checked) => 
                handleOptionChange('checkSimilarity', checked as boolean)
              }
            />
            <Label htmlFor="checkSimilarity" className="text-sm text-gray-600">
              Check for similar content
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkParaphrasing"
              checked={options.checkParaphrasing}
              onCheckedChange={(checked) => 
                handleOptionChange('checkParaphrasing', checked as boolean)
              }
            />
            <Label htmlFor="checkParaphrasing" className="text-sm text-gray-600">
              Detect paraphrased content
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="excludeQuotes"
              checked={options.excludeQuotes}
              onCheckedChange={(checked) => 
                handleOptionChange('excludeQuotes', checked as boolean)
              }
            />
            <Label htmlFor="excludeQuotes" className="text-sm text-gray-600">
              Exclude quoted text
            </Label>
          </div>
        </div>
      </div>

      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing || content.trim().length < 10}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Check for Plagiarism
          </>
        )}
      </Button>
    </div>
  );
}
