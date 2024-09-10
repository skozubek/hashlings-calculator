// pages/_app.tsx

import type { AppProps } from 'next/app';
import { InventoryProvider } from '../contexts/InventoryContext';
import { BitcoinProvider } from '../contexts/BitcoinContext';
import { UserHashcraftersProvider } from '../contexts/UserHashcraftersContext';
import Layout from '../components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserHashcraftersProvider>
      <BitcoinProvider>
        <InventoryProvider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer position="top-right" autoClose={3000} />
          </Layout>
        </InventoryProvider>
      </BitcoinProvider>
    </UserHashcraftersProvider>
  );
}

export default MyApp;