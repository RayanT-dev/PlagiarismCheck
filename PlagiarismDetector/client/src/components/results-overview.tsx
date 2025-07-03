import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlagiarismAnalysisResult } from "@/lib/types";

interface ResultsOverviewProps {
  results: PlagiarismAnalysisResult | null;
}

export default function ResultsOverview({ results }: ResultsOverviewProps) {
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
        <div className="text-center text-gray-500 py-8">
          <p>Submit your content to see plagiarism analysis results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Originality Score</span>
          <span className="text-2xl font-bold text-green-600">{results.originalityScore}%</span>
        </div>
        <Progress value={results.originalityScore} className="h-3" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{results.originalPercentage}%</div>
          <div className="text-sm text-gray-600">Original</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{results.paraphrasedPercentage}%</div>
          <div className="text-sm text-gray-600">Paraphrased</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{results.plagiarizedPercentage}%</div>
          <div className="text-sm text-gray-600">Plagiarized</div>
        </div>
      </div>


    </div>
  );
}
