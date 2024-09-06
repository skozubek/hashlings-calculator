import type { AppProps } from 'next/app';
import { InventoryProvider } from '../contexts/InventoryContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InventoryProvider>
      <Component {...pageProps} />
    </InventoryProvider>
  );
}

export default MyApp;