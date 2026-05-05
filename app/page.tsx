'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCards } from '@/context/CardContext';
import { Play, PlusCircle, BookOpen, Eye, Star, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { cards, getStats } = useCards();

  const stats = getStats();

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">法考学习助手</h1>
          <p className="text-gray-300">选择您想要进行的操作</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => router.push('/library')}
            className="bg-white rounded-2xl shadow-xl p-8 text-left hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">开始练习</h2>
            <p className="text-gray-600">进入知识书架，开始复习和练习法律知识点</p>
          </button>

          <button
            onClick={() => router.push('/create')}
            className="bg-white rounded-2xl shadow-xl p-8 text-left hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">录入卡片</h2>
            <p className="text-gray-600">创建新的知识点卡片，记录案情和分析要点</p>
          </button>

          <button
            onClick={() => router.push('/stats')}
            className="bg-white rounded-2xl shadow-xl p-8 text-left hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">数据统计</h2>
            <p className="text-gray-600">查看各科目和子类目的学习进度与掌握情况</p>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">学习统计概览</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-400 mr-1" />
                <span className="text-2xl font-bold text-white">{cards.length}</span>
              </div>
              <p className="text-sm text-gray-400">总卡片数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-green-400 mr-1" />
                <span className="text-2xl font-bold text-white">{stats.read}</span>
              </div>
              <p className="text-sm text-gray-400">已阅读</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold text-white">{stats.masteryAvg}</span>
              </div>
              <p className="text-sm text-gray-400">平均掌握度</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
