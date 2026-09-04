import { createFileRoute } from "@tanstack/react-router";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export const Route = createFileRoute("/api/public/tmp-import-upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("x-import-token");
        if (token !== process.env["SUPABASE_PROJECT_ID"]) {
          return new Response("Unauthorized", { status: 401 });
        }
        const path = request.headers.get("x-path");
        if (!path) return new Response("Missing path", { status: 400 });
        const bytes = new Uint8Array(await request.arrayBuffer());
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.storage
          .from("product-images")
          .upload(path, bytes, { contentType: "image/jpeg", cacheControl: "31536000", upsert: true });
        if (error) return new Response(error.message, { status: 500 });
        const { data, error: signError } = await supabaseAdmin.storage
          .from("product-images")
          .createSignedUrl(path, TEN_YEARS);
        if (signError || !data) return new Response(signError?.message ?? "sign failed", { status: 500 });
        return Response.json({ url: data.signedUrl });
      },
      PUT: async ({ request }) => {
        const token = request.headers.get("x-import-token");
        if (token !== process.env["SUPABASE_PROJECT_ID"]) {
          return new Response("Unauthorized", { status: 401 });
        }
        const row = (await request.json()) as Record<string, unknown>;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("products")
          .upsert(row as never, { onConflict: "slug" });
        if (error) return new Response(error.message, { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});
