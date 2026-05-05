'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { categories, subcategories } from '@/data/cards';
import { useCards } from '@/context/CardContext';
import LawCard from '@/components/LawCard';
import { ArrowLeft, Folder, Eye, Star, Hash, X } from 'lucide-react';

// 辅助函数：获取子类目名称
const getSubcategoryName = (sub: string): string => {
  const predefined = subcategories.find(s => s.id === sub);
  return predefined ? predefined.name : sub;
};

export default function CategoryPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { getCardsByCategory, getSubcategories } = useCards();

  const categoryId = decodeURIComponent(params.id as string);
  const category = categories.find(c => c.id === categoryId);
  const displayName = category ? category.name : categoryId;
  const allCards = getCardsByCategory(categoryId);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const cards = selectedTag
    ? allCards.filter(card => card.tags.includes(selectedTag))
    : allCards;

  const stats = {
    total: cards.length,
    masteryAvg: cards.filter(c => c.masteryLevel > 0).length > 0
      ? (cards.filter(c => c.masteryLevel > 0).reduce((sum, c) => sum + c.masteryLevel, 0) / cards.filter(c => c.masteryLevel > 0).length).toFixed(1)
      : '0',
  };

  // 获取子类目列表
  const allSubs = getSubcategories(categoryId);

  // 统计每个子类目下的卡片数量
  const getSubcategoryCards = (subName: string) => {
    return allCards.filter(card => {
      const cardSubName = getSubcategoryName(card.subcategory);
      return cardSubName === subName;
    });
  };

  const tagsSet = new Set<string>();
  allCards.forEach(c => c.tags.forEach(t => tagsSet.add(t)));
  const allTags = Array.from(tagsSet);

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/library')}
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg font-bold text-gray-800">{displayName}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-gray-600">
              <Eye className="w-4 h-4 inline mr-1" />
              共 {stats.total} 张卡片
            </span>
            <span className="text-gray-600">
              <Star className="w-4 h-4 inline mr-1" />
              平均掌握度 {stats.masteryAvg}
            </span>
          </div>
        </div>

        {selectedTag && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-blue-700">
              当前筛选标签: <span className="font-semibold">{selectedTag}</span>，共 {cards.length} 张卡片
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {allTags.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              标签
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tag === selectedTag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {allSubs.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">子类目</p>
            <div className="flex flex-wrap gap-3">
              {allSubs.map(sub => {
                const subCards = getSubcategoryCards(sub);
                const subId = encodeURIComponent(sub);
                return (
                  <button
                    key={sub}
                    onClick={() => router.push(`/category/${encodeURIComponent(categoryId)}/sub/${subId}?name=${encodeURIComponent(sub)}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Folder className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-700">{sub}</span>
                    <span className="text-sm text-gray-500">({subCards.length})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <LawCard key={card.id} card={card} />
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无卡片</p>
          </div>
        )}
      </main>
    </div>
  );
}
