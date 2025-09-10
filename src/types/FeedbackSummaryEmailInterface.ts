export type FeedbackItem = {
  question: string;
  answer: string;
};

export type FeedbackSummaryEmailInterface = {
  orderId: string;
  companyName: string;
  overallSentiment: string;
  summary: string;
  highlights: string[];
  improvements: string[];
  urgentIssues: string[];
  rawFeedback?: FeedbackItem[];
};