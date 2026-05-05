'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/cards';
import { useCards } from '@/context/CardContext';
import { Scale, Shield, FileText, Building, TrendingUp, Globe, ChevronRight, BookOpen, Eye, Star, ArrowLeft, Folder, Shuffle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  scale: <Scale className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  'file-text': <FileText className="w-8 h-8" />,
  building: <Building className="w-8 h-8" />,
  'trending-up': <TrendingUp className="w-8 h-8" />,
  globe: <Globe className="w-8 h-8" />,
};

export default function LibraryPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { getCardsByCategory, cards } = useCards();

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  // 获取所有科目（包括自定义）
  const allCategorySet = new Set<string>();
  cards.forEach(card => allCategorySet.add(card.category));
  const allCategories = Array.from(allCategorySet);

  // 预定义科目按顺序显示
  const predefinedCategories = categories;
  const predefinedIds = new Set(categories.map(c => c.id));
  const customCategories = allCategories.filter(id => !predefinedIds.has(id));

  // 合并显示：先显示预定义，再显示自定义
  const customCategoryObjects: typeof categories = customCategories.map(id => ({
    id,
    name: id,
    icon: 'file-text',
    color: 'bg-gradient-to-br from-gray-400 to-gray-600',
  }));

  const displayCategories = predefinedCategories.concat(customCategoryObjects as any);

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">开始练习</h1>
        </div>

        {/* 随机练习 - 长条列表项 */}
        <button
          onClick={() => router.push('/random-practice')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all transform hover:-translate-y-1 group mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3 text-white">
                <Shuffle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">随机练习</h3>
                <p className="text-white/80 text-sm">自定义条件，随机抽取卡片练习</p>
              </div>
            </div>
            <ChevronRight className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </button>

        {/* 按科目练习 - 标题 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">按科目练习</h2>
        </div>

        {/* 科目列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => {
            const categoryCards = getCardsByCategory(category.id);
            const readCount = categoryCards.filter(c => c.isRead).length;
            const progress = categoryCards.length > 0 ? Math.round((readCount / categoryCards.length) * 100) : 0;
            
            // 计算平均分
            const masteryCards = categoryCards.filter(c => c.masteryLevel > 0);
            const avgMastery = masteryCards.length > 0
              ? (masteryCards.reduce((sum, c) => sum + c.masteryLevel, 0) / masteryCards.length).toFixed(1)
              : '0';

            return (
              <button
                key={category.id}
                onClick={() => router.push(`/category/${encodeURIComponent(category.id)}`)}
                className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-all transform hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${category.color} rounded-lg p-3 text-white`}>
                    {iconMap[category.icon as keyof typeof iconMap] || <Folder className="w-8 h-8" />}
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">{category.name}</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      总卡片
                    </span>
                    <span className="font-medium text-gray-800">{categoryCards.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      已阅读
                    </span>
                    <span className="font-medium text-blue-600">{readCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      平均分
                    </span>
                    <span className="font-medium text-yellow-600">{avgMastery}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">学习进度 {progress}%</p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
