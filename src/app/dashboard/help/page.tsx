'use client';

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">How to Use Cashday</h1>
        
        <div className="space-y-8">
          {/* Getting Started */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
            <p className="text-gray-600 mb-4">
              Cashday helps you manage your money between paydays by breaking down your budget into daily spending limits.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Quick Start:</h3>
              <ol className="list-decimal list-inside text-blue-800 space-y-2">
                <li>Set up your budget period with your payday dates</li>
                <li>Enter your total budget for the period</li>
                <li>Start tracking your daily spending</li>
              </ol>
            </div>
          </section>

          {/* Understanding Your Dashboard */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding Your Dashboard</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Daily Budget</h3>
                <p className="text-gray-600">
                  Your recommended spending limit for each day. This is calculated by dividing your remaining budget by the number of days left in your period.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Rollover Amount</h3>
                <p className="text-gray-600">
                  Any unspent money from previous days. This is added to your total remaining budget.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Total Remaining</h3>
                <p className="text-gray-600">
                  The total amount you have left to spend in this period, including your rollover amount.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Initial Budget</h3>
                <p className="text-gray-600">
                  Your starting budget for this period, including any rollover from the previous period.
                </p>
              </div>
            </div>
          </section>

          {/* Managing Transactions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Managing Transactions</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Keep track of your spending by adding transactions as they happen:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Click "Add Transaction" to record new expenses or income</li>
                <li>Choose the appropriate category for better tracking</li>
                <li>Enter the amount and description</li>
                <li>Review your transactions history to stay on top of your spending</li>
              </ul>
            </div>
          </section>

          {/* Tips for Success */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips for Success</h2>
            <div className="bg-emerald-50 rounded-lg p-4">
              <ul className="space-y-3 text-emerald-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Record transactions as they happen to maintain accurate daily budgets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Check your daily budget each morning to plan your spending</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Use categories consistently to better understand your spending patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Save any unspent daily budget to build up a buffer for larger expenses</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 