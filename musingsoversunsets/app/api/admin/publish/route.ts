import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Prevent caching

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let imagePathStr = "";

    // Save image to public/sunsets if provided
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = `${slug}-${Date.now()}${path.extname(image.name)}`;
      const uploadDir = path.join(process.cwd(), "public/sunsets");
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadDir, imageName), buffer);
      imagePathStr = `/sunsets/${imageName}`;
    }

    // Format Markdown Content with Frontmatter
    const markdownContent = `---
title: "${title}"
date: "${date}"
photo: "${imagePathStr}"
---

${content}
`;

    // Save markdown file to public/musings
    const musingsDir = path.join(process.cwd(), "public/musings");
    if (!fs.existsSync(musingsDir)) {
      fs.mkdirSync(musingsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(musingsDir, `${slug}.md`), markdownContent, "utf8");

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}