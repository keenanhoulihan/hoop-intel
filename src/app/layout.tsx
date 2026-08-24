import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoop Intel",
  description: "Front office, roster and market intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
