'use client';
import { useState } from 'react';
import { auth, db } from '@/firebase/config';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/contexts/CurrencyContext';

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { currency, setCurrencyByCode } = useCurrency();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleCurrencyChange = async (code: CurrencyCode) => {
    try {
      await setCurrencyByCode(code);
    } catch (error) {
      console.error('Error updating currency:', error);
      alert('Failed to update currency preference');
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setIsDeleting(true);
      setDeleteError('');

      // Delete user document
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete all user's periods
      const periodsQuery = query(
        collection(db, 'periods'),
        where('userId', '==', user.uid)
      );
      const periodsSnapshot = await getDocs(periodsQuery);
      const periodDeletions = periodsSnapshot.docs.map(doc => deleteDoc(doc.ref));

      // Delete all user's transactions
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactionDeletions = transactionsSnapshot.docs.map(doc => deleteDoc(doc.ref));

      // Wait for all deletions to complete
      await Promise.all([...periodDeletions, ...transactionDeletions]);

      // Delete the user authentication account
      await user.delete();

      // Redirect to login page
      router.push('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      // Handle re-authentication requirement
      if (error.code === 'auth/requires-recent-login') {
        setDeleteError('For security, please log out and log back in before deleting your account.');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Currency Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency Preferences</h2>
          <div className="grid grid-cols-3 gap-4">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  currency.code === curr.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2 font-bold text-gray-900">{curr.symbol}</div>
                <div className="font-medium text-gray-900">{curr.name}</div>
                <div className="text-sm text-gray-600">{curr.code}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Delete Account */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Delete Account</h3>
            <p className="text-red-700 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            {deleteError && (
              <p className="text-red-600 text-sm mb-4">
                {deleteError}
              </p>
            )}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-700 font-medium">
                  Are you absolutely sure you want to delete your account?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Deleting...
                      </>
                    ) : (
                      'Yes, delete my account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 