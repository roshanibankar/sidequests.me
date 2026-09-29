import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const musingsDir = path.join(process.cwd(), "public/musings");
  if (!fs.existsSync(musingsDir)) {
    return NextResponse.json([]);
  }

  const files = fs.readdirSync(musingsDir);
  const musings = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(musingsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title || file,
        date: data.date || "No date",
      };
    });

  return NextResponse.json(musings);
}