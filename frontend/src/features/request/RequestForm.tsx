import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isErrorResponse, useSubmitInsightsMutation, api } from "../../api/apiSlice";
import type { SuccessResponse } from "../../api/types";
import { useAppDispatch } from "../../app/hooks";
import {
  requestSubmitted,
  responseFailed,
  responseNeedsClarification,
  responseSucceeded,
} from "./sessionSlice";
import { LANGUAGE_OPTIONS, promptSchema, type PromptFormValues } from "./promptSchema";

const DEFAULT_PAGE_SIZE = 10;

export function RequestForm() {
  const dispatch = useAppDispatch();
  const [submitInsights, { isLoading }] = useSubmitInsightsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    mode: "onChange",
    defaultValues: { prompt: "", targetLanguage: "" },
  });

  const onSubmit = async (values: PromptFormValues) => {
    dispatch(requestSubmitted(values));
    try {
      const response = await submitInsights(values).unwrap();
      if (response.status === "SUCCESS") {
        dispatch(responseSucceeded({ contextId: response.contextId }));
        dispatch(
          api.util.upsertQueryData(
            "getInsights",
            { contextId: response.contextId, page: 1, pageSize: DEFAULT_PAGE_SIZE },
            response as SuccessResponse,
          ),
        );
      } else {
        dispatch(responseNeedsClarification({ message: response.message }));
      }
    } catch (err) {
      const error = err as { data?: unknown; status?: number };
      if (isErrorResponse(error.data)) {
        dispatch(responseFailed({ errorCode: error.data.error, message: error.data.message }));
      } else {
        dispatch(
          responseFailed({
            errorCode: "UNKNOWN_ERROR",
            message: "Something went wrong while contacting the server.",
          }),
        );
      }
    }
  };

  return (
    <form className="request-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="prompt">Prompt</label>
        <textarea
          id="prompt"
          rows={3}
          placeholder="Describe what you'd like insights on..."
          {...register("prompt")}
        />
        {errors.prompt && <p className="field-error">{errors.prompt.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="targetLanguage">Target Language</label>
        <select id="targetLanguage" defaultValue="" {...register("targetLanguage")}>
          <option value="" disabled>
            Select a language
          </option>
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.targetLanguage && <p className="field-error">{errors.targetLanguage.message}</p>}
      </div>

      <button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
