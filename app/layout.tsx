import type { Metadata } from "next";
import { Bangers, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import ElevatorFrame from "@/components/elevator/ElevatorFrame";

const bangers = Bangers({
  weight: "400", // Bangers only comes in 400
  variable: "--font-bangers",
  subsets: ["latin"],
});

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ["100", "300", "400", "500", "700", "800", "900"],
  variable: "--font-m-plus",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GhibliElevator AnimeDB V2",
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
        className={`${bangers.variable} ${mPlusRounded.variable} antialiased`}
      >
        <ElevatorFrame>
          {children}
        </ElevatorFrame>
      </body>
    </html>
  );
}
