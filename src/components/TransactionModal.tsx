'use client';
import { useState } from 'react';
import { TransactionCategory } from '@/types/types';

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    type: 'in' | 'out',
    amount: number,
    description: string,
    category: TransactionCategory
  ) => void;
};

const CATEGORIES: TransactionCategory[] = [
  'Food/toiletries',
  'Bills',
  'Fuel',
  'Entertainment',
  'Clothing',
  'Smoking/Vapes',
  'Debt Repayments'
];

export default function TransactionModal({ isOpen, onClose, onSubmit }: TransactionModalProps) {
  const [type, setType] = useState<'in' | 'out'>('out');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Food/toiletries');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && description && category) {
      onSubmit(type, Number(amount), description, category);
      setAmount('');
      setDescription('');
      setCategory('Food/toiletries');
      setType('out');
      onClose();
    }
  };

  return (
    isOpen ? (
      <div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen min-w-screen flex items-center justify-center" style={{ zIndex: 9999 }}>
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl p-8 w-full max-w-md border border-gray-200">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Transaction</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('out')}
                  className={`py-3 rounded-xl font-medium transition-colors ${
                    type === 'out'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Money Out
                </button>
                <button
                  type="button"
                  onClick={() => setType('in')}
                  className={`py-3 rounded-xl font-medium transition-colors ${
                    type === 'in'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Money In
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-base font-medium text-gray-900 mb-2">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">£</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  name="amount"
                  id="amount"
                  required
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  className="block w-full pl-10 pr-4 py-3 text-lg text-gray-900 font-medium border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-base font-medium text-gray-900 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-3 text-lg text-gray-900 font-medium border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-base font-medium text-gray-900 mb-2">
                Category
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="block w-full px-4 py-3 text-lg text-gray-900 font-medium border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!amount || !description}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  amount && description
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
} 