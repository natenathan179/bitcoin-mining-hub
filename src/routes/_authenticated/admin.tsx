import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Package, Layers, Star, Store, Wallet, Radar } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Bitcoin Mining Depot" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "Products", icon: Package, exact: true },
  { to: "/admin/categories", label: "Categories", icon: Layers, exact: false },
  { to: "/admin/reviews", label: "Reviews", icon: Star, exact: false },
  { to: "/admin/payments", label: "Payments", icon: Wallet, exact: false },
  { to: "/admin/indexing", label: "Search engines", icon: Radar, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-3">
          <Logo />
          <span className="rounded-sm bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            Admin
          </span>
          <nav className="ml-auto flex flex-wrap items-center gap-1 text-sm">
            {LINKS.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                inactiveProps={{ className: "text-charcoal hover:bg-secondary" }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium text-charcoal hover:bg-secondary"
            >
              <Store className="h-4 w-4" aria-hidden="true" /> View store
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}