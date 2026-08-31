import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Local Discover — Find Small Businesses Near You",
    template: "%s — Local Discover",
  },
  description:
    "Discover independent businesses, local makers, and community vendors in your city. A free directory for the businesses that make neighborhoods unique.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://localdiscover.app"),
  openGraph: {
    title: "Local Discover — Find Small Businesses Near You",
    description:
      "Discover independent businesses, local makers, and community vendors in your city.",
    type: "website",
    locale: "en_US",
    images: [
      { url: "/opengraph-image.png", width: 1200, height: 630, alt: "Local Discover" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#C84B31",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-linen text-charcoal font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
