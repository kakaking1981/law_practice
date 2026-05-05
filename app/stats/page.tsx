'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCards } from '@/context/CardContext';
import { categories } from '@/data/cards';
import { BookOpen, Eye, Star, TrendingUp, Clock, Target, ArrowLeft, Folder } from 'lucide-react';

export default function StatsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { cards, getCardsByCategory } = useCards();

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  const stats = {
    total: cards.length,
    read: cards.filter(c => c.isRead).length,
    unread: cards.filter(c => !c.isRead).length,
    avgMastery: cards.filter(c => c.masteryLevel > 0).length > 0
      ? (cards.filter(c => c.masteryLevel > 0).reduce((sum, c) => sum + c.masteryLevel, 0) / cards.filter(c => c.masteryLevel > 0).length).toFixed(1)
      : '0',
    totalReadCount: cards.reduce((sum, c) => sum + c.readCount, 0),
    mastered: cards.filter(c => c.masteryLevel >= 4).length,
  };

  const categoryStats = categories.map(cat => {
    const catCards = getCardsByCategory(cat.id);
    return {
      ...cat,
      total: catCards.length,
      read: catCards.filter(c => c.isRead).length,
      avgMastery: catCards.filter(c => c.masteryLevel > 0).length > 0
        ? (catCards.filter(c => c.masteryLevel > 0).reduce((sum, c) => sum + c.masteryLevel, 0) / catCards.filter(c => c.masteryLevel > 0).length).toFixed(1)
        : '0',
    };
  });

  const subcategoryStats = categories.flatMap(cat => {
    const catCards = getCardsByCategory(cat.id);
    const subcategoryMap = new Map<string, { name: string; categoryName: string; total: number; masteryAvg: string }>();

    catCards.forEach(card => {
      const existing = subcategoryMap.get(card.subcategory);
      if (existing) {
        existing.total += 1;
        if (card.masteryLevel > 0) {
          const currentTotal = parseFloat(existing.masteryAvg) * (existing.total - 1) + card.masteryLevel;
          existing.masteryAvg = (currentTotal / existing.total).toFixed(1);
        }
      } else {
        subcategoryMap.set(card.subcategory, {
          name: card.subcategory,
          categoryName: cat.name,
          total: 1,
          masteryAvg: card.masteryLevel > 0 ? card.masteryLevel.toString() : '0',
        });
      }
    });

    return Array.from(subcategoryMap.values());
  });

  const masteryDistribution = [
    { level: '未评价', count: cards.filter(c => c.masteryLevel === 0).length },
    { level: '1分', count: cards.filter(c => c.masteryLevel === 1).length },
    { level: '2分', count: cards.filter(c => c.masteryLevel === 2).length },
    { level: '3分', count: cards.filter(c => c.masteryLevel === 3).length },
    { level: '4分', count: cards.filter(c => c.masteryLevel === 4).length },
    { level: '5分', count: cards.filter(c => c.masteryLevel === 5).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg font-bold text-gray-800">法考助手</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">学习统计</h1>
          <p className="text-gray-600">查看你的学习进度和掌握情况</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">总卡片</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.read}</p>
            <p className="text-sm text-gray-500">已阅读</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.unread}</p>
            <p className="text-sm text-gray-500">未阅读</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.avgMastery}</p>
            <p className="text-sm text-gray-500">平均掌握度</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalReadCount}</p>
            <p className="text-sm text-gray-500">总阅读次数</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.mastered}</p>
            <p className="text-sm text-gray-500">已掌握</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">各科目进度</h2>
            <div className="space-y-4">
              {categoryStats.map(cat => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <span className="text-sm text-gray-500">
                      {cat.total}张 ({cat.avgMastery === '0' ? '未评价' : `均分${cat.avgMastery}`})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${cat.color}`}
                      style={{ width: cat.total > 0 ? `${(cat.read / cat.total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">掌握程度分布</h2>
            <div className="space-y-3">
              {masteryDistribution.map(item => {
                const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                return (
                  <div key={item.level}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{item.level}</span>
                      <span className="text-sm text-gray-500">{item.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          item.level === '未评价' ? 'bg-gray-400' :
                          item.level === '1分' ? 'bg-red-400' :
                          item.level === '2分' ? 'bg-orange-400' :
                          item.level === '3分' ? 'bg-yellow-400' :
                          item.level === '4分' ? 'bg-green-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">各子类目统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategoryStats.map((sub, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-800">{sub.name}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{sub.categoryName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{sub.total} 张卡片</span>
                  <span className="text-sm text-gray-500">
                    {sub.masteryAvg === '0' ? '未评价' : `均分 ${sub.masteryAvg}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">学习建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.unread > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">待学习</h3>
                <p className="text-sm text-yellow-700">还有 {stats.unread} 张卡片未阅读，继续加油！</p>
              </div>
            )}
            {cards.filter(c => c.masteryLevel > 0 && c.masteryLevel <= 2).length > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">需要复习</h3>
                <p className="text-sm text-red-700">
                  {cards.filter(c => c.masteryLevel > 0 && c.masteryLevel <= 2).length} 张卡片掌握度较低，建议复习
                </p>
              </div>
            )}
            {stats.mastered > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">已掌握</h3>
                <p className="text-sm text-green-700">
                  {stats.mastered} 张卡片已掌握，继续保持！
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
