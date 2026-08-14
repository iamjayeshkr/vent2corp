import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "vent2corp | say it raw, send it right.",
  description:
    "Turn your unfiltered thoughts, Hinglish vents, and raw frustration into clean, professional workplace communications.",
  openGraph: {
    title: "vent2corp | say it raw, send it right.",
    description:
      "Turn your unfiltered thoughts into clean, professional workplace messages.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vent2corp | say it raw, send it right.",
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
      className={`${inter.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-purple-500/20 selection:text-purple-600">
        {children}
      </body>
    </html>
  );
}
