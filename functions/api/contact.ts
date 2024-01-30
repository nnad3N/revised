import type { PagesFunction } from "@cloudflare/workers-types";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

interface Env {
  ENVIRONMENT?: "development" | "production";
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  RESEND_API_KEY: string;
  EMAIL_RECEIVERS: string;
}

type ContactForm = {
  name: string;
  email: string;
  message: string;
  honeypot: string;
};

type EmailData = Omit<ContactForm, "honeypot"> & {
  country: string;
  city: string;
  timezone: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  //   const IS_DEV = env.ENVIRONMENT === "development";

  const data = (await request
    .json()
    .catch(() => new Response(null, { status: 400 }))) as Partial<ContactForm>;

  if (data.honeypot) {
    return new Response(null, { status: 200 });
  }

  const { name, email, message } = data;

  if (!name || !email || !message) {
    return new Response(null, { status: 400 });
  }

  try {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(4, "24 h"),
      analytics: true,
      prefix: "ratelimit",
    });

    const { success, reset } = await ratelimit.limit(
      request.headers.get("CF-Connecting-IP") ?? "unknown",
    );

    if (!success) {
      return new Response(reset.toString(), { status: 429 });
    }

    let template = await redis.get<string>("contact-email-template");

    if (!template) {
      throw new Error("Missing email template");
    }

    const emailData: EmailData = {
      name,
      email,
      message,
      country: String(request.cf?.country) ?? "Brak informacji",
      city: String(request.cf?.city) ?? "Brak informacji",
      timezone: String(request.cf?.timezone) ?? "Brak informacji",
    };

    for (const key in emailData) {
      const value = emailData[key as keyof EmailData];
      template = template.replace(`{{${key}}}`, value);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Revised <noreply@notifications.revised.pl>",
        // to: IS_DEV ? ["delivered@resend.dev"] : EMAIL_RECEIVERS.split(","),
        to: ["delivered@resend.dev"],
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
