import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ErrorResponse,
  GetInsightsRequest,
  SubmitInsightsRequest,
  SubmitInsightsResponse,
  SuccessResponse,
} from "./types";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Insights"],
  endpoints: (builder) => ({
    submitInsights: builder.mutation<SubmitInsightsResponse, SubmitInsightsRequest>({
      query: (body) => ({
        url: "/api/insights",
        method: "POST",
        body,
      }),
    }),
    getInsights: builder.query<SuccessResponse, GetInsightsRequest>({
      query: ({ contextId, page, pageSize }) => ({
        url: `/api/insights/${contextId}`,
        params: { page, pageSize },
      }),
      providesTags: (_result, _error, arg) => [{ type: "Insights", id: `${arg.contextId}` }],
    }),
  }),
});

export const { useSubmitInsightsMutation, useGetInsightsQuery } = api;

export function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === "object" && data !== null && "error" in data && "message" in data;
}
