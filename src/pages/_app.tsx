// pages/_app.tsx

import type { AppProps } from 'next/app';
import { InventoryProvider } from '../contexts/InventoryContext';
import { BitcoinProvider } from '../contexts/BitcoinContext';
import { UserHashcraftersProvider } from '../contexts/UserHashcraftersContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserHashcraftersProvider>
      <BitcoinProvider>
        <InventoryProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </InventoryProvider>
      </BitcoinProvider>
    </UserHashcraftersProvider>
  );
}

export default MyApp;