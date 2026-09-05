/**
 * Retry a server-side read a couple of times before letting it fail.
 *
 * Route loaders call server functions over an internal request. During a heavy
 * crawl a single dropped internal request used to bubble out of the loader and
 * render an HTTP 500 for that URL — which audits report as a 5xx error and as a
 * broken internal link on every page that links to it. Retrying absorbs the
 * transient failure instead.
 */
export async function retryRead<T>(read: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await read();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 120 * (attempt + 1)));
    }
  }
  throw lastError;
}
