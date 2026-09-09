export interface TavilySearchResponse {
  answer?: string;
  query: string;
  response_time: number;
  results: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
    raw_content?: string;
  }>;
}

export async function searchTavily(query: string, searchDepth: "basic" | "advanced" = "basic"): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY environment variable is missing.");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: searchDepth,
      include_answer: true,
      max_results: 5
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.statusText}`);
  }

  return response.json();
}

export async function searchWeb(query: string, maxResults: number = 5): Promise<TavilySearchResponse["results"]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY environment variable is missing.");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: maxResults,
      include_answer: false
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results || [];
}

export function formatSearchContext(results: Array<{ title: string; url: string; content: string }>): string {
  return results.map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nContent: ${r.content}\n`).join("\n");
}
