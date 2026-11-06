import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chef Mode (Recipes)",
  description: "Color-coded plant-forward recipes & kitchen ideas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#faf8f5]">
      <body className="min-h-screen bg-[#faf8f5] text-[#2c302e] antialiased m-0 p-0 selection:bg-[#556b2f] selection:text-white">
        {children}
      </body>
    </html>
  );
}