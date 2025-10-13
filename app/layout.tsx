import type { Metadata } from "next";
import { Inter, Fahkwang } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const fahkwang = Fahkwang({
  variable: "--font-fahkwang",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Maurice A. Ferré Foundation",
  description:
    "The Maurice A. Ferré Foundation is dedicated to supporting education, arts, and community development initiatives.",
  openGraph: {
    title: "Maurice A. Ferré Foundation",
    description:
      "The Maurice A. Ferré Foundation is dedicated to supporting education, arts, and community development initiatives.",
    siteName: "Maurice A. Ferré Foundation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maurice A. Ferré Foundation",
    description:
      "The Maurice A. Ferré Foundation is dedicated to supporting education, arts, and community development initiatives.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fahkwang.variable} font-sans antialiased`}>
        <div className="root">{children}</div>
      </body>
    </html>
  );
}
