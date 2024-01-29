import type { APIContext } from "astro";
import { type Request } from "@cloudflare/workers-types";

export type CloudflareAPIRoute<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props extends Record<string, any> = Record<string, any>,
> = (
  context: APIContext<Props> & { request: Request },
) => Response | Promise<Response>;
