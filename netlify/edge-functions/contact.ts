import type { Config, Context } from "@netlify/edge-functions";
import { Redis } from "https://esm.sh/@upstash/redis@1.24.3";
import { Ratelimit } from "https://cdn.skypack.dev/@upstash/ratelimit@v0.4.4";

type ContactForm = {
  name?: string;
  email?: string;
  message?: string;
  honeypot?: string;
};

type EmailData = NonNullable<Omit<ContactForm, "honeypot">> & {
  country: string;
  city: string;
  timezone: string;
};

export default async (request: Request, context: Context) => {
  const IS_DEV = Netlify.env.get("NETLIFY_DEV") === "true";
  const UPSTASH_REDIS_REST_URL = Netlify.env.get("UPSTASH_REDIS_REST_URL");
  const UPSTASH_REDIS_REST_TOKEN = Netlify.env.get("UPSTASH_REDIS_REST_TOKEN");
  const RESEND_API_KEY = Netlify.env.get("RESEND_API_KEY");
  const EMAIL_RECEIVERS = Netlify.env.get("EMAIL_RECEIVERS");

  if (
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN ||
    !RESEND_API_KEY ||
    !EMAIL_RECEIVERS
  ) {
    throw new Error("Missing environment variables");
  }

  if (!IS_DEV && request.method !== "POST") {
    return new Response(null, { status: 400 });
  }

  if (!IS_DEV && request.url !== context.site.url) {
    return new Response(null, { status: 401 });
  }

  //   const data = (await request
  //     .json()
  //     .catch(() => new Response(null, { status: 400 }))) as Partial<ContactForm>;

  //   if (data.honeypot) {
  //     return new Response(null, { status: 200 });
  //   }

  //   if (!data.email || !data.name || !data.message) {
  //     return new Response(null, { status: 400 });
  //   }

  try {
    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(4, "24 h"),
      analytics: true,
      prefix: "revised-ratelimit",
    });

    const { success } = await ratelimit.limit(context.ip);

    if (!success) {
      return new Response(null, { status: 429 });
    }

    let template = await redis.get<string>("revised-contact-email-template");

    if (!template) {
      throw new Error("Missing email template");
    }

    const emailData: EmailData = {
      name: "Ania",
      email: "ania@gmail.com",
      message: "This is a test message",
      country: context.geo.country?.name ?? "Brak informacji",
      city: context.geo.city ?? "Brak informacji",
      timezone: context.geo.timezone ?? "Brak informacji",
    };

    for (const key in emailData) {
      const value = emailData[key as keyof EmailData];
      template = template.replace(`{{${key}}}`, value ?? "Brak");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Revised <noreply@notifications.revised.pl>",
        to: IS_DEV ? ["delivered@resend.dev"] : EMAIL_RECEIVERS.split(","),
        subject: "Wiadomość z formularza na revised.pl",
        html: template,
      }),
    });

    if (res.ok) {
      return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/contact",
};
