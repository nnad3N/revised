import type { CloudflareAPIRoute } from "@/types";

export const GET: CloudflareAPIRoute = (ctx) => {
  return new Response(JSON.stringify(ctx), { status: 200 });
};
