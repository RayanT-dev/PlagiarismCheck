import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TextInput from "@/components/text-input";
import ResultsOverview from "@/components/results-overview";
import DetectedIssues from "@/components/detected-issues";
import DetailedReport from "@/components/detailed-report";
import { PlagiarismAnalysisResult, AnalysisOptions } from "@/lib/types";

export default function Home() {
  const [content, setContent] = useState("");
  const [options, setOptions] = useState<AnalysisOptions>({
    checkSimilarity: true,
    checkParaphrasing: true,
    excludeQuotes: false,
  });
  const [results, setResults] = useState<PlagiarismAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { content: string } & AnalysisOptions) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data: PlagiarismAnalysisResult) => {
      setResults(data);
      toast({
        title: "Analysis Complete",
        description: `Originality score: ${data.originalityScore}%`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred during analysis",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (content.trim().length < 10) {
      toast({
        title: "Content too short",
        description: "Please provide at least 10 characters for analysis",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate({
      content,
      ...options,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TextInput
              content={content}
              onContentChange={setContent}
              options={options}
              onOptionsChange={setOptions}
              onAnalyze={handleAnalyze}
              isAnalyzing={analyzeMutation.isPending}
            />
          </div>

          <div className="space-y-6">
            <ResultsOverview results={results} />
            <DetectedIssues issues={results?.detectedIssues || []} />
          </div>
        </div>

        <DetailedReport results={results} />
      </main>

      <Footer />
    </div>
  );
}
