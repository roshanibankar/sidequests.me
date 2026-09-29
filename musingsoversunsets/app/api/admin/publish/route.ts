import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = "force-dynamic";

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
    const originalSlug = formData.get("originalSlug") as string | null;
    const image = formData.get("image") as File | null;

    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const musingsDir = path.join(process.cwd(), "public/musings");
    const sunsetsDir = path.join(process.cwd(), "public/sunsets");

    if (!fs.existsSync(musingsDir)) fs.mkdirSync(musingsDir, { recursive: true });
    if (!fs.existsSync(sunsetsDir)) fs.mkdirSync(sunsetsDir, { recursive: true });

    let imagePathStr = "";
    let oldImagePathToCleanup = "";

    // If editing an existing post, check its current data
    if (originalSlug) {
      const oldFilePath = path.join(musingsDir, `${originalSlug}.md`);
      if (fs.existsSync(oldFilePath)) {
        const oldFileContent = fs.readFileSync(oldFilePath, "utf8");
        const { data: oldData } = matter(oldFileContent);
        
        imagePathStr = oldData.photo || ""; // Keep old photo path by default
        oldImagePathToCleanup = oldData.photo || "";

        // If title/slug changed, remove the old markdown file
        if (originalSlug !== newSlug) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    // Handle new image upload
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = `${newSlug}-${Date.now()}${path.extname(image.name)}`;
      
      // Save new image
      fs.writeFileSync(path.join(sunsetsDir, imageName), buffer);
      imagePathStr = `/sunsets/${imageName}`;

      // If there was an old image, delete it now that the new one is saved
      if (oldImagePathToCleanup) {
        const cleanOldPath = oldImagePathToCleanup.startsWith("/") ? oldImagePathToCleanup.slice(1) : oldImagePathToCleanup;
        const oldImageFullPath = path.join(process.cwd(), "public", cleanOldPath);
        if (fs.existsSync(oldImageFullPath)) {
          fs.unlinkSync(oldImageFullPath);
        }
      }
    }

    // Format new Markdown content
    const markdownContent = `---
title: "${title}"
date: "${date}"
photo: "${imagePathStr}"
---

${content}
`;

    fs.writeFileSync(path.join(musingsDir, `${newSlug}.md`), markdownContent, "utf8");

    return NextResponse.json({ success: true, slug: newSlug });
  } catch (error) {
    console.error("Publish/Update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}