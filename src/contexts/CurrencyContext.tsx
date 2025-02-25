'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const CURRENCIES = [
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];

type CurrencyContextType = {
  currency: typeof CURRENCIES[number];
  setCurrencyByCode: (code: CurrencyCode) => Promise<void>;
  formatAmount: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Check if user document exists
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
              email: user.email,
              currency: 'GBP',
              createdAt: new Date()
            });
            setCurrency(CURRENCIES[0]);
          } else {
            // Load existing currency preference
            const currencyCode = userDoc.data()?.currency || 'GBP';
            const selectedCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
            setCurrency(selectedCurrency);
          }
        } catch (error) {
          console.error('Error loading currency preference:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setCurrencyByCode = async (code: CurrencyCode) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const newCurrency = CURRENCIES.find(c => c.code === code);
      if (!newCurrency) return;

      const userDocRef = doc(db, 'users', user.uid);
      
      // Update or create the user document
      await setDoc(userDocRef, {
        currency: code,
        updatedAt: new Date()
      }, { merge: true });

      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error updating currency:', error);
      throw error;
    }
  };

  const formatAmount = (amount: number) => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyByCode, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 