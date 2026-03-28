import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { WSProvider } from "@/components/shared/ws-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "recall-stack dashboard",
  description: "Visual control plane for your Claude Code memory system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex h-screen bg-[#fafbfc] text-zinc-800">
        <WSProvider>
          <NotificationProvider>
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </NotificationProvider>
        </WSProvider>
      </body>
    </html>
  );
}
