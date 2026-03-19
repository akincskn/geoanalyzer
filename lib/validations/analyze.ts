import { z } from "zod";

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^0\.0\.0\.0$/,
];

function isPrivateUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return BLOCKED_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
  } catch {
    return true;
  }
}

export const analyzeSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    )
    .refine(
      (url) => !isPrivateUrl(url),
      "Private or internal network URLs are not allowed"
    ),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
