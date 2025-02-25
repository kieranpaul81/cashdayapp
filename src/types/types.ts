export type TransactionCategory = 
  | 'Food/toiletries'
  | 'Bills'
  | 'Fuel'
  | 'Entertainment'
  | 'Clothing'
  | 'Smoking/Vapes'
  | 'Debt Repayments';

export type Transaction = {
  id: string;
  type: 'in' | 'out';
  amount: number;
  description: string;
  category: TransactionCategory;
  date: Date;
  userId: string;
  periodId: string;
};

export type TimePeriod = {
  id: string;
  startDate: Date;
  endDate: Date;
  initialAmount: number;
  rolloverAmount: number;
  userId: string;
}; 