import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";

const MAX_BYTES = 4.5 * 1024 * 1024; // Vercel serverless body limit headroom

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 4.5MB)." }, { status: 400 });
  }

  // Preferred path: Vercel Blob storage (persists properly in production).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`covers/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Fallback for local prototyping with no cloud storage configured yet:
  // store the image inline as a base64 data URL. Fine for a prototype,
  // not recommended for a large production library.
  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
  return NextResponse.json({ url: dataUrl });
}
