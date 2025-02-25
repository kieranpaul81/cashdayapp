'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { db } from '@/firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export default function UsersPage() {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      if (!isAdmin) {
        console.log('Not admin, redirecting');
        router.push('/dashboard');
        return;
      }

      try {
        console.log('Starting to fetch users...');
        const usersRef = collection(db, 'users');
        console.log('Created users ref:', usersRef.path);
        
        const snapshot = await getDocs(usersRef);
        console.log('Got snapshot, size:', snapshot.size);
        console.log('Raw data:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        if (!mounted) return;

        const usersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || 'No email',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLoginAt: data.lastLoginAt?.toDate() || null
          };
        });

        console.log('Processed users:', usersData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [isAdmin, router]);

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'users', userId));
      
      // Update the users list
      setUsers(users.filter(user => user.id !== userId));
      
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <span className="text-sm font-medium text-gray-500">
            Total Users: {users.length}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Login</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.firstName || user.lastName 
                        ? `${user.firstName} ${user.lastName}`.trim()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {user.lastLoginAt ? user.lastLoginAt.toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        disabled={user.email === 'admin@cashday.app'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 