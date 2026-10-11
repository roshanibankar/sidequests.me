import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  
  // Prevent the browser from caching the logout response
  res.headers.set("Cache-Control", "no-store, max-age=0");
  
  return res;
}