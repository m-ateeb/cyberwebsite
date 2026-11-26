import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().min(2, "Please enter a subject.").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(3000),
  website: z.string().optional(), // Honeypot field
});

interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "contact-messages.json");

function saveMessageLocally(record: ContactMessageRecord): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let existing: ContactMessageRecord[] = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing = parsed;
    }
    existing.push(record);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2), "utf8");
  } catch {
    // On read-only serverless environments, optional webhook/Resend handles delivery.
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please check all fields.",
        },
        { status: 400 }
      );
    }

    // Silently accept bot submissions that fill the hidden honeypot field
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        message: "Thanks for reaching out! Your message has been received.",
      });
    }

    const record: ContactMessageRecord = {
      id: `msg_${Date.now()}`,
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      subject: parsed.data.subject,
      message: parsed.data.message,
      receivedAt: new Date().toISOString(),
    };

    saveMessageLocally(record);

    // Server-side Web3Forms fallback (only if client-side public key is not set)
    const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3FormsKey && !process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY) {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          from_name: "StratumSec Contact",
          name: record.name,
          email: record.email,
          replyto: record.email,
          subject: `[StratumSec Contact] ${record.subject}`,
          message: record.message,
        }),
      }).catch(() => {});
    }

    // Optional Resend email delivery (set RESEND_API_KEY in .env.local or Vercel)
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail =
      process.env.CONTACT_TO_EMAIL ??
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
      "mateebsaleemi@gmail.com";
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "StratumSec <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: record.email,
          subject: `[StratumSec Contact] ${record.subject}`,
          text: `From: ${record.name} <${record.email}>\n\n${record.message}`,
        }),
      }).catch(() => {});
    }

    // Optional external webhook forwarding (e.g., Discord, Slack, Formspree, Make)
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks for reaching out! Your message has been sent.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send message. Please try again." },
      { status: 500 }
    );
  }
}
