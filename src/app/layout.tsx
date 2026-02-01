import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/src/components/Navbar";

export const metadata: Metadata = {
  title: "Soundtrack Explorer",
  description: "Discover movie soundtracks by mood and atmosphere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-black text-white min-h-screen"
        suppressHydrationWarning
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
