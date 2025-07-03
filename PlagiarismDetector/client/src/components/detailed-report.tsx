import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlagiarismAnalysisResult } from "@/lib/types";

interface DetailedReportProps {
  results: PlagiarismAnalysisResult | null;
}

export default function DetailedReport({ results }: DetailedReportProps) {
  if (!results) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Detailed Analysis Report</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete breakdown of content analysis with recommendations
        </p>
      </div>

      <div className="p-6">
        <Tabs defaultValue="highlighted" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="highlighted">Highlighted Text</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="highlighted" className="mt-6">
            <div className="mb-8">
              <h3 className="text-base font-semibold mb-4">Your text with highlighted similarities</h3>
              <div className="bg-gray-50 p-4 rounded-lg border text-sm leading-relaxed">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: results.highlightedText
                      .replace(/class="highlight-plagiarism"/g, 'class="bg-red-200 text-red-800 px-1 rounded"')
                      .replace(/class="highlight-paraphrasing"/g, 'class="bg-yellow-200 text-yellow-800 px-1 rounded"')
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-medium mb-3">Legend</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Plagiarized content</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Paraphrased content</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Original content</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-6">
            <div className="space-y-4">
              {results.detectedIssues.map((issue, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{issue.source}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {issue.similarity}% similarity - {issue.type}
                      </p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                        "{issue.text}"
                      </p>
                    </div>
                    {issue.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={issue.url} target="_blank" rel="noopener noreferrer">
                          Visit Source
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4 text-blue-900">
                <Lightbulb className="inline mr-2 h-5 w-5" />
                Recommendations for Improvement
              </h3>
              <div className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
