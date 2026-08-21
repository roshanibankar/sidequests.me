import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedIn } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(book);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const status = ["READING", "RECOMMENDED", "READ"].includes(body.status)
    ? body.status
    : "RECOMMENDED";

  const rating =
    status === "READ" && body.rating !== undefined && body.rating !== null && body.rating !== ""
      ? Math.max(0, Math.min(10, Number(body.rating)))
      : null;

  try {
    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: String(body.title).trim(),
        author: body.author ? String(body.author).trim() : null,
        type: String(body.type).trim(),
        genre: String(body.genre).trim(),
        status,
        rating,
        coverUrl: body.coverUrl ? String(body.coverUrl) : null,
        review: body.review ? String(body.review).trim() : null,
      },
    });
    return NextResponse.json(book);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.book.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
