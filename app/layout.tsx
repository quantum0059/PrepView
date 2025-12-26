import type { Metadata } from "next";
import {Mona_Sans} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "PrepWise",
  description: "An Ai-powered mock interview platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}

//by applying className="dark" we are telling shadcn and other components who use both light and dark components to use only dark componensts
//this is a global layout page in which the chnages apply to all pages in the application