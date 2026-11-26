import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

interface SubscriberRecord {
  email: string;
  subscribedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

function readSubscribers(): SubscriberRecord[] {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSubscribers(records: SubscriberRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // On serverless hosts (e.g. Vercel), cloud providers (Buttondown/Brevo) persist subscribers.
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            parsed.error.issues[0]?.message ?? "Enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    // 1. Buttondown (Free tier, Markdown-native, built-in double opt-in & unsubscribe, no domain required)
    const buttondownKey = process.env.BUTTONDOWN_API_KEY;
    if (buttondownKey) {
      const bdRes = await fetch("https://api.buttondown.com/v1/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Token ${buttondownKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          tags: ["stratumsec"],
        }),
      });

      if (bdRes.ok) {
        const existing = readSubscribers();
        if (!existing.some((s) => s.email === email)) {
          existing.push({ email, subscribedAt: new Date().toISOString() });
          writeSubscribers(existing);
        }
        return NextResponse.json({
          ok: true,
          alreadySubscribed: false,
          message: "Subscribed! Check your inbox to confirm your email.",
        });
      }

      const bdErr = await bdRes.json().catch(() => ({}));
      const errText = JSON.stringify(bdErr).toLowerCase();
      if (
        bdRes.status === 400 &&
        (errText.includes("already") || errText.includes("exists"))
      ) {
        return NextResponse.json({
          ok: true,
          alreadySubscribed: true,
          message: "You're already subscribed to StratumSec dispatches.",
        });
      }

      return NextResponse.json(
        {
          ok: false,
          error: "Could not complete subscription. Please check the email and try again.",
        },
        { status: 502 }
      );
    }

    // 2. Brevo (Free tier: 300 emails/day, unlimited contacts, no domain required)
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      const listId = process.env.BREVO_LIST_ID
        ? Number(process.env.BREVO_LIST_ID)
        : undefined;

      const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          updateEnabled: true,
          ...(listId && !Number.isNaN(listId) ? { listIds: [listId] } : {}),
        }),
      });

      if (brevoRes.ok || brevoRes.status === 204) {
        const existing = readSubscribers();
        if (!existing.some((s) => s.email === email)) {
          existing.push({ email, subscribedAt: new Date().toISOString() });
          writeSubscribers(existing);
        }
        return NextResponse.json({
          ok: true,
          alreadySubscribed: brevoRes.status === 204,
          message:
            brevoRes.status === 204
              ? "You're already subscribed to StratumSec dispatches."
              : "Subscribed! You'll receive the next dispatch.",
        });
      }

      return NextResponse.json(
        {
          ok: false,
          error: "Could not complete subscription. Please try again.",
        },
        { status: 502 }
      );
    }

    // 3. Local JSON fallback (for local development without a cloud newsletter provider)
    const existing = readSubscribers();
    const alreadySubscribed = existing.some((s) => s.email === email);

    if (!alreadySubscribed) {
      existing.push({
        email,
        subscribedAt: new Date().toISOString(),
      });
      writeSubscribers(existing);
    }

    // Optional external webhook forwarding
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
    if (webhookUrl && !alreadySubscribed) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "stratumsec-newsletter" }),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed,
      message: alreadySubscribed
        ? "You're already subscribed to StratumSec dispatches."
        : "Subscribed! You'll receive the next dispatch.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not process subscription. Please try again." },
      { status: 500 }
    );
  }
}
