import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <script src="https://checkout.razorpay.com/v1/checkout.js" defer />
          <link rel="manifest" id="manifest" href="/api/manifest" />
          <meta name="theme-color" content="#ffffff" />
          {/* <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link rel="icon" href="/icon-192x192.png" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="description" content="Tutor" />
          <meta name="keywords" content="Tutor" />
          <meta name="author" content="Tutor" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="Tutor" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="Tutor" />
          <meta name="msapplication-TileColor" content="#2194fc" />
          <meta name="msapplication-TileImage" content="/icon-192x192.png" />
          <meta name="msapplication-config" content="/browserconfig.xml" /> */}

          {/* TODO add ios support later */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
