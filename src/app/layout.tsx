import type { Metadata } from "next";
import { Anton, Caveat, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
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

const anton = Anton({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vent2corp.com"),
  title: "vent2corp | say it raw, send it right.",
  description:
    "Turn your unfiltered thoughts, Hinglish rants and workplace frustration into professional messages you can actually send.",
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
      className={`${inter.variable} ${caveat.variable} ${anton.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-950 selection:bg-yellow-300 selection:text-gray-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
