'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-950 text-white">Loading...</div>;

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-950 p-4 text-center text-white">
        <h2 className="text-2xl font-bold">Aap Login Nahi Hain</h2>
        <p className="mt-2 text-gray-400">Apply aur AI Pitch jaise features use karne ke liye login karein.</p>
        <button 
          onClick={() => router.push('/login')}
          className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700 transition-all"
        >
          Login Page Par Jayein
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
