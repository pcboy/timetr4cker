import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import * as React from "react";

class LFDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head></Head>

        <body className="text-gray-700 bg-neutral-100 print:bg-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LFDocument;
