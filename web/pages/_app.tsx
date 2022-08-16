import * as React from "react";
import { Component } from "react";

import { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
