'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { categories } from '@/data/cards';
import { useCards } from '@/context/CardContext';
import LawCard from '@/components/LawCard';
import { ArrowLeft, Eye, Star } from 'lucide-react';

export default function SubcategoryPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { getCardsBySubcategory, getCardsByCategory } = useCards();

  const categoryId = decodeURIComponent(params.id as string);
  const subId = params.subId as string;
  const subName = decodeURIComponent(searchParams.get('name') || '待定');

  const category = categories.find(c => c.id === categoryId);
  const displayCategoryName = category ? category.name : categoryId;
  const cards = getCardsBySubcategory(categoryId, subName);

  const readCount = cards.filter(c => c.isRead).length;
  const avgMastery = cards.filter(c => c.masteryLevel > 0).length > 0
    ? (cards.filter(c => c.masteryLevel > 0).reduce((sum, c) => sum + c.masteryLevel, 0) / cards.filter(c => c.masteryLevel > 0).length).toFixed(1)
    : '0';

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/category/${encodeURIComponent(categoryId)}`)}
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-bold text-gray-800">{displayCategoryName}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{subName}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{subName}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-gray-600">
              <Eye className="w-4 h-4 inline mr-1" />
              共 {cards.length} 张卡片
            </span>
            <span className="text-gray-600">
              <Star className="w-4 h-4 inline mr-1" />
              平均掌握度 {avgMastery}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <LawCard key={card.id} card={card} />
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">该子类目下暂无卡片</p>
          </div>
        )}
      </main>
    </div>
  );
}
