import type { Metadata } from "next";
import { Masthead } from "@/components/shell/Masthead";
import { Footer } from "@/components/shell/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoop Intel",
  description: "Front office, roster and market intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Masthead />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
