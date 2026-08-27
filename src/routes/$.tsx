import { createFileRoute, redirect } from "@tanstack/react-router";

// Catch-all: any URL that doesn't match a real route is sent to the homepage.
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => null,
});
