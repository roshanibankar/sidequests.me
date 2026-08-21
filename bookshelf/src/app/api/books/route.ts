import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedIn } from "@/lib/auth";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!body.type || !body.genre) {
    return NextResponse.json(
      { error: "Type and genre are required." },
      { status: 400 }
    );
  }

  const status = ["READING", "RECOMMENDED", "READ"].includes(body.status)
    ? body.status
    : "RECOMMENDED";

  const rating =
    status === "READ" && body.rating !== undefined && body.rating !== null && body.rating !== ""
      ? Math.max(0, Math.min(10, Number(body.rating)))
      : null;

  const book = await prisma.book.create({
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

  return NextResponse.json(book, { status: 201 });
}
