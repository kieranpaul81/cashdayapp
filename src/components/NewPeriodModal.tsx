'use client';
import { useState } from 'react';

type NewPeriodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, endDate: Date, rolloverAmount: number) => void;
};

export default function NewPeriodModal({ isOpen, onClose, onSubmit }: NewPeriodModalProps) {
  const [amount, setAmount] = useState('');
  const [rolloverAmount, setRolloverAmount] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set default date to 30 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  const defaultDateString = defaultDate.toISOString().split('T')[0];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && endDate) {
      onSubmit(
        Number(amount), 
        new Date(endDate), 
        rolloverAmount ? Number(rolloverAmount) : 0
      );
      setAmount('');
      setRolloverAmount('');
      setEndDate('');
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
            <h2 className="text-2xl font-bold text-gray-900">Set Your Budget</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-base font-medium text-gray-900 mb-2">
                How much do you want to budget?
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
              <label htmlFor="rolloverAmount" className="block text-base font-medium text-gray-900 mb-2">
                Rollover amount from previous budget (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">£</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  name="rolloverAmount"
                  id="rolloverAmount"
                  value={rolloverAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setRolloverAmount(value);
                    }
                  }}
                  className="block w-full pl-10 pr-4 py-3 text-lg text-gray-900 font-medium border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-base font-medium text-gray-900 mb-2">
                When is your next payday?
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                required
                min={new Date().toISOString().split('T')[0]}
                value={endDate || defaultDateString}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-4 py-3 text-lg text-gray-900 font-medium border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
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
                disabled={!amount || !endDate}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  amount && endDate
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Start Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
} 