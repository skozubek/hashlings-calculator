// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          © Copyright 2024, created by {' '}
          <Link href="https://x.com/0xPhantom_" target="_blank" rel="noopener noreferrer">
            Phantom
          </Link>
        </p>
        <p className="mb-2">BTC data Provided by minerstat®</p>
        <p>BTC TIP Jar: bc1qv9udhuqvh9wpgf79tc5v2e98sux03chghanzn4</p>
      </div>
    </footer>
  );
};

export default Footer;