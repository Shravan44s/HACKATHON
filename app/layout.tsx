import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeScript from "@/components/shared/ThemeScript";
import ChatWidget from "@/components/shared/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Make It Happen | AI-Powered Hackathon Platform",
  description: "The ultimate hackathon management platform with embedded AI agents.",
  keywords: ["hackathon", "AI", "platform", "competition", "coding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <TooltipProvider>
          {children}
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: {
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--card-foreground)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '0.875rem',
              },
            }}
          />
          <ChatWidget />
        </TooltipProvider>
      </body>
    </html>
  );
}
