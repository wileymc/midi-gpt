import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider, useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Analytics />
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}

export function Toaster() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      theme={theme === "dark" ? "dark" : "light"}
      position="bottom-center"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      draggable
    />
  );
}
