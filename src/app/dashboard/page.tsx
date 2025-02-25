'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, Timestamp, deleteDoc, doc, orderBy, limit, getDocs } from 'firebase/firestore';
import NewPeriodModal from '@/components/NewPeriodModal';
import TransactionModal from '@/components/TransactionModal';
import { Transaction, TimePeriod, TransactionCategory } from '@/types/types';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showNewPeriodModal, setShowNewPeriodModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyBudget, setDailyBudget] = useState<number>(0);
  const [totalRemaining, setTotalRemaining] = useState<number>(0);
  const { formatAmount } = useCurrency();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        setUserId(user.uid);
        // Fetch user's current period and transactions
        fetchUserData(user.uid);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = (uid: string) => {
    let unsubTransactions: (() => void) | undefined;

    // Subscribe to periods
    const unsubPeriods = onSnapshot(query(
      collection(db, 'periods'),
      where('userId', '==', uid)
    ), (snapshot) => {
      if (snapshot.empty) {
        setCurrentPeriod(null);
        setTransactions([]);
        return;
      }

      // Get the most recent period
      const periods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate()
      })) as TimePeriod[];

      const currentPeriod = periods.sort((a, b) => 
        b.startDate.getTime() - a.startDate.getTime()
      )[0];
      
      setCurrentPeriod(currentPeriod);

      // Cleanup previous transaction listener if it exists
      if (unsubTransactions) {
        unsubTransactions();
      }

      // Set up new transaction listener
      unsubTransactions = onSnapshot(query(
        collection(db, 'transactions'),
        where('userId', '==', uid),
        where('periodId', '==', currentPeriod.id)
      ), (transSnapshot) => {
        const transactions = transSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as Transaction[];
        
        setTransactions(transactions);
      });
    });

    // Return cleanup function
    return () => {
      unsubPeriods();
      if (unsubTransactions) {
        unsubTransactions();
      }
    };
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const calculateDailyBudget = () => {
    if (!currentPeriod) return 0;
    
    const totalTransactions = transactions.reduce((acc, trans) => {
      return acc + (trans.type === 'in' ? trans.amount : -trans.amount);
    }, 0);

    const totalAvailable = currentPeriod.initialAmount + 
      currentPeriod.rolloverAmount + totalTransactions;

    const daysRemaining = Math.ceil(
      (currentPeriod.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    setTotalRemaining(totalAvailable);
    setDailyBudget(totalAvailable / (daysRemaining || 1));
  };

  useEffect(() => {
    calculateDailyBudget();
  }, [currentPeriod, transactions]);

  const handleNewPeriod = async (amount: number, endDate: Date, rolloverAmount: number) => {
    if (!userId) return;

    try {
      // Create new period document
      const newPeriod = {
        userId,
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(endDate),
        initialAmount: amount,
        rolloverAmount: rolloverAmount || 0
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'periods'), newPeriod);

      // Update local state
      setCurrentPeriod({
        id: docRef.id,
        ...newPeriod,
        startDate: new Date(),
        endDate: endDate,
      });

      // Close modal
      setShowNewPeriodModal(false);

      // Reset transactions for new period
      setTransactions([]);

      // Calculate initial daily budget including rollover
      const daysRemaining = Math.ceil(
        (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = amount + (rolloverAmount || 0);
      setDailyBudget(totalAmount / (daysRemaining || 1));
      setTotalRemaining(totalAmount);

    } catch (error) {
      console.error('Error adding period:', error);
      alert('Failed to create new period');
    }
  };

  const handleNewTransaction = async (
    type: 'in' | 'out',
    amount: number,
    description: string,
    category: TransactionCategory
  ) => {
    if (!userId || !currentPeriod) {
      alert('Please create a budget period first');
      return;
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        userId,
        periodId: currentPeriod.id, // Add reference to current period
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
      // No need to update state manually as the onSnapshot listener will handle it
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const handleResetBudget = async () => {
    if (!userId || !currentPeriod) return;

    const confirmReset = window.confirm(
      'Are you sure you want to reset your budget? This will clear all your current data.'
    );

    if (!confirmReset) return;

    try {
      setLoading(true);

      // Delete all transactions in the main transactions collection
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactionDeletions = transactionsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(transactionDeletions);

      // Delete all transactions in the user's subcollection
      const userTransactionsQuery = collection(db, 'users', userId, 'transactions');
      const userTransactionsSnapshot = await getDocs(userTransactionsQuery);
      const userTransactionDeletions = userTransactionsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(userTransactionDeletions);

      // Delete the current period document
      await deleteDoc(doc(db, 'periods', currentPeriod.id));

      // Delete the current period reference in user's subcollection
      await deleteDoc(doc(db, 'users', userId, 'currentPeriod', 'current'));

      // Reset local state
      setCurrentPeriod(null);
      setTransactions([]);
      setDailyBudget(0);
      setTotalRemaining(0);
      setShowNewPeriodModal(true);

    } catch (error) {
      console.error('Error resetting budget:', error);
      alert('Failed to reset budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Current period listener
  useEffect(() => {
    if (!user) return () => {};

    let unsubscribePeriod: () => void;
    let unsubscribeTransactions: () => void;

    try {
      // Get current period
      unsubscribePeriod = onSnapshot(
        doc(db, 'users', user.uid, 'currentPeriod', 'current'),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setCurrentPeriod({
              ...data,
              startDate: data.startDate.toDate(),
              endDate: data.endDate.toDate(),
            });
          } else {
            setCurrentPeriod(null);
          }
        }
      );

      // Get transactions
      unsubscribeTransactions = onSnapshot(
        collection(db, 'users', user.uid, 'transactions'),
        (snapshot) => {
          const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate()
          }));
          setTransactions(transactions);
        }
      );
    } catch (error) {
      console.error('Error setting up listeners:', error);
    }

    // Cleanup function
    return () => {
      if (unsubscribePeriod) unsubscribePeriod();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, [user]);

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {!currentPeriod ? (
        // Welcome Screen
        <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto border border-gray-200">
          <div className="text-center">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome to Cashday.app</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Take control of your spending by setting up your daily budget. We'll help you track and manage your money effectively.
            </p>
            <button
              onClick={() => setShowNewPeriodModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors text-lg font-medium"
            >
              Create Your First Budget
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Budget Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Current Budget Period</h2>
                <span className="text-gray-600">
                  - {Math.max(
                    Math.ceil(
                      (currentPeriod.endDate.getTime() - new Date().getTime()) / 
                      (1000 * 60 * 60 * 24)
                    ),
                    0
                  )} days remaining
                </span>
              </div>
              
              <button
                onClick={handleResetBudget}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset Budget
              </button>
            </div>

            {/* Budget Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Daily Budget Card */}
              <div className="p-6 rounded-xl bg-emerald-50">
                <h3 className="text-sm font-medium text-emerald-900">Daily Budget</h3>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {formatAmount(dailyBudget)}
                </p>
              </div>

              {/* Rollover Amount Card */}
              <div className="p-6 rounded-xl bg-blue-50">
                <h3 className="text-sm font-medium text-blue-900">Rollover Amount</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {formatAmount(currentPeriod.rolloverAmount || 0)}
                </p>
              </div>

              {/* Total Remaining Card */}
              <div className="p-6 rounded-xl bg-amber-50">
                <h3 className="text-sm font-medium text-amber-900">Total Remaining</h3>
                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {formatAmount(totalRemaining)}
                </p>
              </div>

              {/* Initial Budget Card */}
              <div className="p-6 rounded-xl bg-purple-50">
                <h3 className="text-sm font-medium text-purple-900">Initial Budget</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {formatAmount((currentPeriod?.initialAmount || 0) + (currentPeriod?.rolloverAmount || 0))}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
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
                          {new Date(transaction.date).toLocaleDateString()}
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
        </>
      )}

      {/* Modals */}
      <NewPeriodModal
        isOpen={showNewPeriodModal}
        onClose={() => setShowNewPeriodModal(false)}
        onSubmit={handleNewPeriod}
      />
      
      {currentPeriod && showTransactionModal && (
        <TransactionModal
          isOpen={true}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleNewTransaction}
        />
      )}
    </>
  );
} 