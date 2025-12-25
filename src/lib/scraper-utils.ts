import axios from "axios";

// Tạo axios instance với config chung
export const httpClient = axios.create({
  timeout: 30000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
  },
});

// Format số
export function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// Parse số từ string (VD: "1.5M" -> 1500000)
export function parseCount(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[,\s]/g, "").toLowerCase();
  const num = parseFloat(cleaned);
  if (cleaned.includes("b")) return num * 1000000000;
  if (cleaned.includes("m")) return num * 1000000;
  if (cleaned.includes("k")) return num * 1000;
  return parseInt(cleaned) || 0;
}

// Delay helper
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry với exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await delay(delayMs * Math.pow(2, i));
      }
    }
  }
  throw lastError;
}

// Extract JSON từ HTML script tag
export function extractJsonFromScript(
  html: string,
  startMarker: string,
  endMarker: string
): unknown | null {
  try {
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) return null;

    const jsonStart = startIndex + startMarker.length;
    const endIndex = html.indexOf(endMarker, jsonStart);
    if (endIndex === -1) return null;

    const jsonStr = html.substring(jsonStart, endIndex);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// Sanitize username
export function sanitizeUsername(username: string): string {
  return username.replace(/^@/, "").trim().toLowerCase();
}
