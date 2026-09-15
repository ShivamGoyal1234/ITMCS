export interface Insight {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse {
  status: "SUCCESS";
  contextId: string;
  insights: Insight[];
  pagination: Pagination;
}

export interface ClarificationResponse {
  status: "NEEDS_CLARIFICATION";
  message: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export type SubmitInsightsResponse = SuccessResponse | ClarificationResponse;

export interface SubmitInsightsRequest {
  prompt: string;
  targetLanguage: string;
  contextId?: string;
}

export interface GetInsightsRequest {
  contextId: string;
  page: number;
  pageSize: number;
}
