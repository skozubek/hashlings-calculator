import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p>
          © Copyright 2024, created by {' '}
          <Link href="https://x.com/0xPhantom_" target="_blank" rel="noopener noreferrer">
            Phantom
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;