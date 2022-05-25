import '../styles/globals.css';
import 'react-spring-bottom-sheet/dist/style.css';
import React, { useEffect } from 'react';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { AccessTokenProvider } from '../hooks/authentication/use-access-token-context';
import Head from 'next/head';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { AccountProvider } from '../hooks/authentication/use-account-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import { MockTagProvider } from '../hooks/use-mock-tag-context';

const firebaseConfig = {
  apiKey: 'AIzaSyDxXUSxSLuzKFuEhACAGtuvYZC-nTf70l0',
  authDomain: 'memverse.firebaseapp.com',
  databaseURL: 'https://memverse-default-rtdb.firebaseio.com',
  projectId: 'memverse',
  storageBucket: 'memverse.appspot.com',
  messagingSenderId: '645429020198',
  appId: '1:645429020198:web:56cdb892fda7c4c8e088e7',
  measurementId: 'G-R4HBRGPMS3',
};

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeApp(firebaseConfig);
    getAnalytics();
  }, []);

  return (
    <MockTagProvider>
      <RecoilRoot>
        <ChakraProvider>
          <AccessTokenProvider>
            <QueryClientProvider client={queryClient}>
              <AccountProvider>
                <Head>
                  <title>Memspace</title>
                </Head>
                <Component {...pageProps} />
              </AccountProvider>
            </QueryClientProvider>
          </AccessTokenProvider>
        </ChakraProvider>
      </RecoilRoot>
    </MockTagProvider>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
}

export default App;
