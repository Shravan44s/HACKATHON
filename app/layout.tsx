import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Make It Happen | AI-Powered Hackathon Platform",
  description: "The ultimate hackathon management platform with embedded AI agents. From enrollment to final presentation — make it happen.",
  keywords: ["hackathon", "AI", "platform", "competition", "coding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} ${syne.variable} antialiased`}>
        <TooltipProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                boxShadow: '0 8px 30px rgba(124, 58, 237, 0.08)',
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
