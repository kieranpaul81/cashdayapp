'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

interface AdminContextType {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType>({ isAdmin: false });

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log('AdminContext - Current user:', user?.email);
    if (user?.email === 'admin@cashday.app') {
      console.log('Setting user as admin');
      setIsAdmin(true);
    } else {
      console.log('User is not admin');
      setIsAdmin(false);
    }
  }, [user]);

  console.log('AdminContext - isAdmin:', isAdmin);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext); 