import type { Metadata } from "next";
//import localFont from "next/font/local";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import MyNavbar from "@/components/MyNavbar/MyNavbar";
import MyFooter from "@/components/MyFooter/MyFooter";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";

/* const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
}); */

export const metadata: Metadata = {
  title: "iTransition-ROR",
  description: "iTransition_Internship-ROR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
        <ReduxProvider>
            <MyNavbar />
        {children}
        <MyFooter />
        </ReduxProvider>
        </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
