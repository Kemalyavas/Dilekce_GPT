'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Plus, User, LogOut, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalDilekce: 0,
    thisMonth: 0,
    lastDilekce: null as string | null
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DilekçeGPT
            </Link>
            <span className="text-gray-500">|</span>
            <span className="text-gray-700">Hoşgeldin, {user.user_metadata?.full_name || 'Kullanıcı'}</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
            >
              <User className="h-5 w-5" />
              <span>Profil</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalDilekce}</span>
            </div>
            <h3 className="text-gray-600">Toplam Dilekçe</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.thisMonth}</span>
            </div>
            <h3 className="text-gray-600">Bu Ayki Dilekçe</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
              <span className="text-sm text-gray-500">
                {stats.lastDilekce || 'Henüz yok'}
              </span>
            </div>
            <h3 className="text-gray-600">Son Dilekçe</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Hızlı İşlemler</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/"
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <Plus className="h-6 w-6" />
              <span className="text-lg font-semibold">Yeni Dilekçe Oluştur</span>
            </Link>

            <Link
              href="/my-documents"
              className="flex items-center justify-center space-x-3 bg-gray-100 text-gray-700 p-6 rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <FileText className="h-6 w-6" />
              <span className="text-lg font-semibold">Dilekçelerim</span>
            </Link>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Son Dilekçeler</h2>

          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Henüz dilekçe oluşturmadınız</p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              İlk dilekçenizi oluşturun →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}