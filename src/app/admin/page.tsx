'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { db } from '@/firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    async function fetchStats() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const transactionsSnapshot = await getDocs(collection(db, 'transactions'));

        setStats({
          totalUsers: usersSnapshot.size,
          activeUsers: usersSnapshot.docs.filter(doc => {
            const lastLogin = doc.data().lastLoginAt?.toDate();
            if (!lastLogin) return false;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return lastLogin > thirtyDaysAgo;
          }).length,
          totalTransactions: transactionsSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="p-6 rounded-xl bg-emerald-50">
            <h3 className="text-sm font-medium text-emerald-900">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.totalUsers}</p>
          </div>

          <div className="p-6 rounded-xl bg-blue-50">
            <h3 className="text-sm font-medium text-blue-900">Active Users (30d)</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.activeUsers}</p>
          </div>

          <div className="p-6 rounded-xl bg-purple-50">
            <h3 className="text-sm font-medium text-purple-900">Total Transactions</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{stats.totalTransactions}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 