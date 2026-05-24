import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUIZMANIA: Run For The Answer",
  description: "AI-викторина в аркадном лабиринте.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
