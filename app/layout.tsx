import type { Metadata } from "next";
import { Comfortaa, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import ElevatorFrame from "@/components/elevator/ElevatorFrame";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "GhibliElevator AnimeDB",
  description: "A Studio Ghibli inspired anime discovery elevator.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.variable} ${notoSansJP.variable} antialiased`}
      >
        <ElevatorFrame>
          {children}
        </ElevatorFrame>
      </body>
    </html>
  );
}
