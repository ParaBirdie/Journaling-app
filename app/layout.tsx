import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journal",
  description: "A beautiful, minimal journaling app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
