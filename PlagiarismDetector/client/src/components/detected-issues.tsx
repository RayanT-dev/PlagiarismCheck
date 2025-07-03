import { AlertTriangle, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetectedIssue } from "@/lib/types";

interface DetectedIssuesProps {
  issues: DetectedIssue[];
}

export default function DetectedIssues({ issues }: DetectedIssuesProps) {
  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Detected Issues</h3>
        <div className="text-center text-gray-500 py-4">
          <p>No issues detected. Great work!</p>
        </div>
      </div>
    );
  }

  const displayedIssues = issues.slice(0, 3);
  const remainingCount = issues.length - displayedIssues.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Detected Issues</h3>
      
      <div className="space-y-4">
        {displayedIssues.map((issue, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${
              issue.type === 'plagiarism'
                ? 'border-red-500 bg-red-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <AlertTriangle 
                    className={`mr-2 h-4 w-4 ${
                      issue.type === 'plagiarism' ? 'text-red-500' : 'text-yellow-500'
                    }`}
                  />
                  <span className={`font-medium ${
                    issue.type === 'plagiarism' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {issue.type === 'plagiarism' ? 'Plagiarism Detected' : 'Paraphrased Content'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {issue.similarity}% similarity
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  "{issue.text.substring(0, 100)}..."
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  <a 
                    href={issue.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary underline"
                  >
                    {issue.source}
                  </a>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-4">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {remainingCount > 0 && (
        <Button variant="link" className="w-full mt-4 text-primary">
          View All Issues ({remainingCount} more)
        </Button>
      )}
    </div>
  );
}
