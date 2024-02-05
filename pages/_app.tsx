import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider, useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-zinc-900",
  dark: "bg-white-600 font-gray-300",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Analytics />
      <Layout>
        <Component {...pageProps} />
        <ToastContainer
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName={(context) =>
            contextClass[context?.type || "default"] +
            " relative flex p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
          }
          bodyClassName={() => "text-sm font-white font-med block p-3"}
        />
      </Layout>
    </ThemeProvider>
  );
}
