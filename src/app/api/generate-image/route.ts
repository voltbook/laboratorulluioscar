import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  title: z.string().min(2).max(120),
  prompt: z.string().min(2).max(1200).optional(),
});

const unsafeImagePatterns = [/explos/i, /firework/i, /igniter/i, /deton/i, /weapon/i, /jammer/i, /arm[ăa]/i];

function fallbackSvg(title: string) {
  const safeTitle = title.replace(/[<>&"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050806"/>
      <stop offset=".55" stop-color="#0a1410"/>
      <stop offset="1" stop-color="#001b0b"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#00ff66" stroke-opacity=".15" stroke-width="1"/>
    </pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1200" height="750" fill="url(#bg)"/>
  <rect width="1200" height="750" fill="url(#grid)"/>
  <g transform="translate(600 360)" filter="url(#glow)">
    <rect x="-190" y="-80" width="380" height="160" rx="12" fill="#06120b" stroke="#00ff66" stroke-width="4"/>
    <rect x="-126" y="-36" width="118" height="72" rx="6" fill="#0c2b18" stroke="#8cffb5" stroke-width="3"/>
    <circle cx="86" cy="0" r="42" fill="#00ff66" fill-opacity=".85"/>
    <path d="M-250 80 L250 80 M-250 -80 L250 -80 M-285 0 L-190 0 M190 0 L285 0" stroke="#00ff66" stroke-width="6" stroke-linecap="round"/>
    <circle cx="-286" cy="0" r="10" fill="#00ff66"/>
    <circle cx="286" cy="0" r="10" fill="#00ff66"/>
  </g>
  <text x="72" y="104" fill="#00ff66" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="28" letter-spacing="8">CONCEPT IMAGE // OSCAR LAB</text>
  <text x="72" y="650" fill="#ffffff" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="58" font-weight="700">${safeTitle}</text>
  <text x="72" y="700" fill="#8cffb5" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="24">generated locally · no paid image quota required</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Cerere imagine invalidă." }, { status: 400 });

  const text = `${parsed.data.title} ${parsed.data.prompt ?? ""}`;
  if (unsafeImagePatterns.some((pattern) => pattern.test(text))) {
    return NextResponse.json({
      status: "blocked",
      imageUrl: fallbackSvg("Concept sigur recomandat"),
      providerStatus: "Imaginea a fost înlocuită cu o variantă sigură.",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      status: "ready",
      imageUrl: fallbackSvg(parsed.data.title),
      providerStatus: "Imagine generată local gratuit.",
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const image = await client.images.generate({
      model: "gpt-image-1",
      size: "1024x1024",
      prompt:
        parsed.data.prompt ??
        `Professional clean product render of a safe low-voltage Romanian DIY hardware project titled ${parsed.data.title}. Dark cyber laboratory background, visible electronics, no dangerous devices.`,
    });
    const b64 = image.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image returned.");
    return NextResponse.json({
      status: "ready",
      imageUrl: `data:image/png;base64,${b64}`,
      providerStatus: "Imagine generată cu OpenAI Images.",
    });
  } catch {
    return NextResponse.json({
      status: "ready",
      imageUrl: fallbackSvg(parsed.data.title),
      providerStatus: "OpenAI Images nu a răspuns sau nu are quota; am folosit generatorul local gratuit.",
    });
  }
}
