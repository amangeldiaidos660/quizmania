import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUIZMANIA: Run For The Answer",
  description: "AI-powered arcade quiz game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
