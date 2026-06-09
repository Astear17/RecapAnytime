const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errJson = await response.json();
      errorMsg = errJson?.error?.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json() as Promise<T>;
}
export { API_BASE_URL };
