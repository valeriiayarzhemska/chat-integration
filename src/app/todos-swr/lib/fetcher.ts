export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    const error: Error & { info?: unknown; status?: number } = new Error(
      'An error occurred while fetching the data.',
    );

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export async function sendRequest<T>(
  url: string,
  { arg }: { arg: { method: string; body?: unknown } },
): Promise<T> {
  const res = await fetch(url, {
    method: arg.method,
    headers: arg.body ? { 'Content-Type': 'application/json' } : {},
    body: arg.body ? JSON.stringify(arg.body) : undefined,
  });

  if (!res.ok) {
    const error: Error & { info?: unknown; status?: number } = new Error(
      'Request failed',
    );

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
}
