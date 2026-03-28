const HINDSIGHT_URL = process.env.HINDSIGHT_URL || "http://localhost:8888";
const BANK = "claude-sessions";

let available = false;

export async function checkHindsight(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${HINDSIGHT_URL}/v1/default/banks`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    available = res.ok;
    return available;
  } catch {
    available = false;
    return false;
  }
}

export function isAvailable(): boolean {
  return available;
}

export async function recallPatterns(
  query: string,
  n = 10
): Promise<string[]> {
  if (!available) return [];

  try {
    const res = await fetch(
      `${HINDSIGHT_URL}/v1/default/banks/${BANK}/memories/recall`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, n }),
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map(
      (r: { text?: string }) => r.text || ""
    );
  } catch {
    return [];
  }
}
