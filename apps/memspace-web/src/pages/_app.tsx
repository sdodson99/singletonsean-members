import '../styles/globals.css';
import 'react-spring-bottom-sheet/dist/style.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { GApiProvider } from 'react-gapi-auth2';
import { AccessTokenProvider } from '../hooks/authentication/use-access-token-context';
import Head from 'next/head';

const googleClientConfig = {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  scope: 'https://www.googleapis.com/auth/youtube.readonly',
};

function App({ Component, pageProps }: AppProps) {
  return (
    <GApiProvider clientConfig={googleClientConfig}>
      <AccessTokenProvider>
        <Head>
          <title>Memspace</title>
        </Head>
        <Component {...pageProps} />
      </AccessTokenProvider>
    </GApiProvider>
  );
}

export default App;
