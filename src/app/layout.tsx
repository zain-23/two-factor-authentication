import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Two Factor Authentication",
  description: "Two factor authentication with nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${recursive.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
