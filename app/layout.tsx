
import "./globals.css";

import { gilroy } from "@/lib/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={gilroy.variable}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
