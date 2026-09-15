import { z } from "zod";

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
] as const;

export const promptSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required"),
  targetLanguage: z.enum(
    LANGUAGE_OPTIONS.map((option) => option.value) as [string, ...string[]],
    { message: "Select a target language" },
  ),
});

export type PromptFormValues = z.infer<typeof promptSchema>;
