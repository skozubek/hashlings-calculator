// contexts/UserHashcraftersContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Inscription } from '../types';

interface UserHashcraftersContextType {
  userHashcrafters: Inscription[];
  setUserHashcrafters: React.Dispatch<React.SetStateAction<Inscription[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserHashcraftersContext = createContext<UserHashcraftersContextType | undefined>(undefined);

export const UserHashcraftersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userHashcrafters, setUserHashcrafters] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <UserHashcraftersContext.Provider 
      value={{ 
        userHashcrafters, 
        setUserHashcrafters, 
        loading, 
        setLoading, 
        error, 
        setError 
      }}
    >
      {children}
    </UserHashcraftersContext.Provider>
  );
};

export const useUserHashcraftersContext = () => {
  const context = useContext(UserHashcraftersContext);
  if (context === undefined) {
    throw new Error('useUserHashcraftersContext must be used within a UserHashcraftersProvider');
  }
  return context;
};