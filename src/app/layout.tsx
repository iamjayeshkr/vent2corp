import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vent2corp | vent unfiltered, communicate professionally",
  description:
    "Turn your unfiltered thoughts, Hinglish vents, and raw frustration into polished workplace messages.",
  openGraph: {
    title: "vent2corp | vent unfiltered, communicate professionally",
    description:
      "Turn your unfiltered thoughts, Hinglish vents, and raw frustration into polished workplace messages.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vent2corp | vent unfiltered, communicate professionally",
    description: "Turn your unfiltered thoughts into professional workplace messages.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
