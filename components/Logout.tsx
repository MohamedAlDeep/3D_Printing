'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch('/api/logout', { method: 'GET' });
    if (res.ok) {
      router.push('/login');
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <button
      onClick={logout}
      type="button"
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Sign Out
    </button>
  );
}