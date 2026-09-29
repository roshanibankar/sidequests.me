import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public/musings", `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      return NextResponse.json({
        title: data.title || "",
        date: data.date || "",
        content: content || "",
        photo: data.photo || "",
      });
    }
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch (error) {
    console.error("Get error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}