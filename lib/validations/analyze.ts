import { z } from "zod";

export const analyzeSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
