import type { CloudflareAPIRoute } from "@/types";

export const GET: CloudflareAPIRoute = ({ request, env }) => {
  console.log(request.cf);

  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      cf: request.cf,
      env: env ?? "no env",
    }),
    { status: 200 },
  );
};
