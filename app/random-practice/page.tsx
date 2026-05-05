'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/cards';
import { useCards } from '@/context/CardContext';
import { ArrowLeft, Check, Star, Shuffle, Tag, Eye, ChevronRight } from 'lucide-react';
import { LawCard } from '@/types';

type SelectionMode = 'none' | 'min' | 'max';

export default function RandomPracticePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { cards } = useCards();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [masteryRange, setMasteryRange] = useState<{ min: number; max: number }>({ min: 1, max: 5 });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none');
  const [showResults, setShowResults] = useState(false);

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  // 获取所有预定义科目（包括自定义的）
  const allCategorySet = new Set<string>();
  cards.forEach(card => allCategorySet.add(card.category));
  const customCategories = Array.from(allCategorySet).filter(
    id => !categories.some(c => c.id === id)
  );

  // 合并显示：预定义科目 + 自定义科目
  const displayCategories = [
    ...categories,
    ...customCategories.map(id => ({
      id,
      name: id,
      icon: 'file-text' as string,
      color: 'bg-gradient-to-br from-gray-400 to-gray-600',
    }))
  ];

  // 筛选并打乱卡片
  const filteredCards = useMemo(() => {
    if (!showResults) return [];

    let result = cards.filter(card => {
      // 科目筛选
      if (selectedCategories.length > 0 && !selectedCategories.includes(card.category)) {
        return false;
      }
      // 掌握程度筛选
      if (card.masteryLevel < masteryRange.min || card.masteryLevel > masteryRange.max) {
        return false;
      }
      return true;
    });

    // 打乱顺序
    const shuffled = [...result].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [cards, selectedCategories, masteryRange, showResults]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleMasteryClick = (level: number) => {
    if (selectionMode === 'none') {
      // 第一次点击，设置为最低值
      setMasteryRange({ min: level, max: level });
      setSelectionMode('max'); // 下次点击设置为最高值
    } else if (selectionMode === 'min') {
      // 正在设置最低值
      if (level <= masteryRange.max) {
        setMasteryRange({ min: level, max: masteryRange.max });
        setSelectionMode('none');
      } else {
        // 如果点击的值比最高值大，交换
        setMasteryRange({ min: masteryRange.max, max: level });
        setSelectionMode('none');
      }
    } else if (selectionMode === 'max') {
      // 正在设置最高值
      if (level >= masteryRange.min) {
        setMasteryRange({ min: masteryRange.min, max: level });
        setSelectionMode('none');
      } else {
        // 如果点击的值比最低值小，交换
        setMasteryRange({ min: level, max: masteryRange.min });
        setSelectionMode('none');
      }
    }
  };

  const handleGenerate = () => {
    setShowResults(true);
  };

  const handleShuffleAgain = () => {
    if (filteredCards.length > 0) {
      setShowResults(false);
      setTimeout(() => setShowResults(true), 0);
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMasteryRange({ min: 1, max: 5 });
    setSelectionMode('none');
    setShowResults(false);
  };

  // 生成星星显示
  const renderStars = (count: number) => {
    return (
      <div className="flex space-x-0.5">
        {[...Array(count)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/library')}
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg font-bold text-gray-800">随机练习</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">筛选条件</h2>

          {/* 科目选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择科目（可多选）
            </label>
            <div className="flex flex-wrap gap-2">
              {displayCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">未选择任何科目，将包含所有科目</p>
            )}
          </div>

          {/* 掌握程度筛选 - 直观双向选择UI */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              掌握程度筛选
            </label>

            {/* 可视化双向选择 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              {/* 选择模式提示 */}
              <div className="text-center mb-4">
                {selectionMode === 'none' && masteryRange.min === masteryRange.max && (
                  <p className="text-gray-600">
                    点击下方数字设置<span className="text-blue-600 font-semibold">最低</span>星级
                  </p>
                )}
                {selectionMode === 'none' && masteryRange.min !== masteryRange.max && (
                  <p className="text-gray-600">
                    当前范围: <span className="text-blue-600 font-semibold">{masteryRange.min}星</span> 
                    <span className="text-gray-400 mx-2">至</span> 
                    <span className="text-purple-600 font-semibold">{masteryRange.max}星</span>
                    <button
                      onClick={() => {
                        setMasteryRange({ min: 1, max: 5 });
                        setSelectionMode('none');
                      }}
                      className="ml-3 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      重置
                    </button>
                  </p>
                )}
                {selectionMode === 'min' && (
                  <p className="text-blue-600 font-medium">
                    当前选择最低: <span className="text-xl">{masteryRange.min}星</span>
                    <span className="text-gray-400 ml-2">→ 点击设置最高星级</span>
                  </p>
                )}
                {selectionMode === 'max' && (
                  <p className="text-purple-600 font-medium">
                    当前选择最高: <span className="text-xl">{masteryRange.max}星</span>
                    <span className="text-gray-400 ml-2">→ 点击确认范围</span>
                  </p>
                )}
              </div>

              {/* 星星选择器 */}
              <div className="flex items-end justify-between mb-4 h-40">
                {[1, 2, 3, 4, 5].map(level => {
                  const isMin = level === masteryRange.min;
                  const isMax = level === masteryRange.max;
                  const isInRange = level >= masteryRange.min && level <= masteryRange.max;
                  const isSelected = isMin || isMax;
                  
                  return (
                    <div key={level} className="flex flex-col items-center flex-1">
                      {/* 可点击区域 */}
                      <div 
                        className={`w-full cursor-pointer transition-all ${
                          isSelected 
                            ? isMin 
                              ? 'opacity-100' 
                              : 'opacity-100'
                            : 'opacity-40 hover:opacity-70'
                        }`}
                        onClick={() => handleMasteryClick(level)}
                      >
                        <div className="flex flex-col items-center">
                          {renderStars(level)}
                          {/* 数字标签 */}
                          <div className={`mt-3 px-3 py-2 rounded-lg text-lg font-bold transition-all ${
                            isMin && isMax
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : isMin
                              ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                              : isMax
                              ? 'bg-purple-500 text-white ring-4 ring-purple-200'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {level}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 范围指示条 */}
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all"
                  style={{
                    left: `${((masteryRange.min - 1) / 4) * 100}%`,
                    width: `${((masteryRange.max - masteryRange.min) / 4) * 100}%`,
                  }}
                />
                {/* 两端标记点 */}
                <div 
                  className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 shadow-lg"
                  style={{ left: `${((masteryRange.min - 1) / 4) * 100}%` }}
                />
                <div 
                  className="absolute w-4 h-4 bg-purple-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 shadow-lg"
                  style={{ left: `${((masteryRange.max - 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* 快速选择按钮 */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">快速选择:</span>
              <button
                onClick={() => {
                  setMasteryRange({ min: 1, max: 1 });
                  setSelectionMode('none');
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  masteryRange.min === 1 && masteryRange.max === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                一星
              </button>
              <button
                onClick={() => {
                  setMasteryRange({ min: 1, max: 2 });
                  setSelectionMode('none');
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  masteryRange.min === 1 && masteryRange.max === 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                一至二星
              </button>
              <button
                onClick={() => {
                  setMasteryRange({ min: 3, max: 3 });
                  setSelectionMode('none');
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  masteryRange.min === 3 && masteryRange.max === 3
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                三星
              </button>
              <button
                onClick={() => {
                  setMasteryRange({ min: 4, max: 5 });
                  setSelectionMode('none');
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  masteryRange.min === 4 && masteryRange.max === 5
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                四至五星
              </button>
              <button
                onClick={() => {
                  setMasteryRange({ min: 1, max: 5 });
                  setSelectionMode('none');
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  masteryRange.min === 1 && masteryRange.max === 5
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
            </div>

            {/* 使用说明 */}
            <p className="text-xs text-gray-400 mt-3">
              💡 操作方式：先点击一个数字设置为最低值，再点击另一个数字设置为最高值，形成范围
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
            >
              <Check className="w-5 h-5" />
              <span>确认生成</span>
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              重置
            </button>
          </div>
        </div>

        {/* 结果展示 */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">练习卡片</h2>
                <p className="text-gray-600 mt-1">
                  共 {filteredCards.length} 张符合条件的卡片
                </p>
              </div>
              {filteredCards.length > 0 && (
                <button
                  onClick={handleShuffleAgain}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="text-sm">重新打乱</span>
                </button>
              )}
            </div>

            {filteredCards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">没有符合条件的卡片</p>
                <p className="text-gray-400 text-sm mt-2">请调整筛选条件后重试</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCards.map(card => (
                  <div
                    key={card.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{card.content}</p>
                        
                        {/* 标签显示 */}
                        {card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {card.tags.map(tag => (
                              <span
                                key={tag}
                                className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex items-center text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium ml-1">{card.masteryLevel}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs ml-1">{card.readCount}次</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
