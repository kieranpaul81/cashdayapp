'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { collection, addDoc, query, where, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { Transaction, TransactionCategory } from '@/types/types';
import TransactionModal from '@/components/TransactionModal';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function TransactionsPage() {
  const { formatAmount } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPeriodId, setCurrentPeriodId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        // Get current period
        const periodQuery = query(
          collection(db, 'periods'),
          where('userId', '==', user.uid)
        );

        const unsubPeriod = onSnapshot(periodQuery, (snapshot) => {
          if (!snapshot.empty) {
            const periods = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            const currentPeriod = periods.sort((a, b) => 
              b.startDate.toDate().getTime() - a.startDate.toDate().getTime()
            )[0];
            setCurrentPeriodId(currentPeriod.id);

            // Get transactions for current period
            const transactionQuery = query(
              collection(db, 'transactions'),
              where('userId', '==', user.uid),
              where('periodId', '==', currentPeriod.id)
            );

            const unsubTransactions = onSnapshot(transactionQuery, (transSnapshot) => {
              const transactions = transSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate()
              })) as Transaction[];
              
              setTransactions(transactions);
            });

            return () => unsubTransactions();
          }
        });

        return () => unsubPeriod();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNewTransaction = async (
    type: 'in' | 'out',
    amount: number,
    description: string,
    category: TransactionCategory
  ) => {
    if (!userId || !currentPeriodId) {
      alert('No active budget period found');
      return;
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        userId,
        periodId: currentPeriodId,
        type,
        amount,
        description,
        category,
        date: Timestamp.fromDate(new Date())
      });

      setShowTransactionModal(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  return (
    <div className="space-y-6">
      {/* Transactions Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Transaction
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                No transactions yet. Add your first transaction!
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div>
                  <p className="font-semibold text-gray-900">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      {transaction.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {transaction.date.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'in' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'in' ? '+' : '-'}{formatAmount(transaction.amount)}
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this transaction?')) {
                        handleDeleteTransaction(transaction.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {currentPeriodId && showTransactionModal && (
        <TransactionModal
          isOpen={true}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleNewTransaction}
        />
      )}
    </div>
  );
} 