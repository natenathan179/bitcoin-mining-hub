import { createFileRoute, notFound } from "@tanstack/react-router";

// Catch-all: any URL that doesn't match a real route. Previously threw a redirect() to
// "/", which returns an HTTP 307 -- a classic "soft 404" that crawlers flag, since the
// URL never actually existed but responds as if it did. notFound() returns a real 404
// while still rendering the same "redirecting to homepage" UX via the root route's
// notFoundComponent (see __root.tsx), so the visitor experience is unchanged.
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw notFound();
  },
  component: () => null,
});
