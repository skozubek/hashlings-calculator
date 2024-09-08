import type { AppProps } from 'next/app';
import { InventoryProvider } from '../contexts/InventoryContext';
import { BitcoinProvider } from '../contexts/BitcoinContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BitcoinProvider>
      <InventoryProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </InventoryProvider>
    </BitcoinProvider>
  );
}

export default MyApp;