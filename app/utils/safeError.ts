import axios from "axios";

type SafeErrorDetails = {
  status?: number;
  code?: string;
  reason?: string;
  message: string;
};

/**
 * Returns only error details that are safe to write to server logs.
 * Never log a whole axios error: it carries the request body (personal data)
 * and the request headers (bearer tokens).
 */
export function describeError(err: unknown): SafeErrorDetails {
  if (axios.isAxiosError<{ error?: { status?: unknown } }>(err)) {
    const reason = err.response?.data?.error?.status;

    return {
      status: err.response?.status,
      code: err.code,
      reason: typeof reason === "string" ? reason : undefined,
      message: err.message,
    };
  }

  return { message: err instanceof Error ? err.message : "Unknown error" };
}
