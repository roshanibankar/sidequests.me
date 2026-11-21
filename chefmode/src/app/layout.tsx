import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "ChefMode",
    template: "%s | ChefMode",
  },
  description: "Your personal recipe and cooking companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-[#faf8f5]">
      <body className="min-h-screen bg-[#faf8f5] text-[#2c302e] antialiased m-0 p-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}