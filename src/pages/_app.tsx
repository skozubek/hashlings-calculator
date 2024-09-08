import type { AppProps } from 'next/app';
import { InventoryProvider } from '../contexts/InventoryContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InventoryProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </InventoryProvider>
  );
}

export default MyApp;