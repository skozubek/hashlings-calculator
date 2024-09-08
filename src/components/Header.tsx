import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100 shadow-sm p-4">
      <div className="container mx-auto flex justify-center items-center">
        <Link href="/">
          <Image
            src="/images/hashlings-logo.webp"
            alt="Hashlings Logo"
            width={300}
            height={80}
            objectFit="contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;