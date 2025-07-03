export interface DetectedIssue {
  type: 'plagiarism' | 'paraphrasing';
  text: string;
  similarity: number;
  source: string;
  url?: string;
  startIndex: number;
  endIndex: number;
}

export interface PlagiarismAnalysisResult {
  originalityScore: number;
  originalPercentage: number;
  paraphrasedPercentage: number;
  plagiarizedPercentage: number;
  detectedIssues: DetectedIssue[];
  recommendations: string[];
  highlightedText: string;
  reportId?: number;
}

export interface AnalysisOptions {
  checkSimilarity: boolean;
  checkParaphrasing: boolean;
  excludeQuotes: boolean;
}
