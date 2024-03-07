import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
import Index from "./index";
export const metadata = {
  title: "SMA",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Index>{children}</Index>
      </body>
    </html>
  );
}
