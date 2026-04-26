export class DataServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "DataServiceError";
  }
}

export function shouldUseMockFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

