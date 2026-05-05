'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCards } from '@/context/CardContext';
import { Search, X, Tag, ArrowLeft } from 'lucide-react';

export default function SearchPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchCards, cards } = useCards();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(cards);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setResults(searchCards(q));
    } else {
      setResults([]);
    }
  }, [searchParams]);

  useEffect(() => {
    setResults(searchCards(query));
  }, [query, searchCards]);

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    router.push('/search');
  };

  const tagsSet = new Set<string>();
  cards.forEach(c => c.tags.forEach(t => tagsSet.add(t)));
  const allTags = Array.from(tagsSet);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">搜索</h1>
          <p className="text-gray-600">通过关键字或标签检索知识点</p>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入关键字搜索..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            热门标签
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">找到 {results.length} 个结果</p>
            {results.map(card => (
              <div
                key={card.id}
                onClick={() => router.push(`/category/${card.category}`)}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{card.title}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {card.chapter.split(' - ')[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{card.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {card.category === 'civil' ? '民法' :
                     card.category === 'criminal' ? '刑法' :
                     card.category === 'criminal-procedure' ? '刑诉法' :
                     card.category === 'admin' ? '行政法' :
                     card.category === 'economic' ? '经济法' : '三国法'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500">未找到匹配的知识点</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">请输入关键字或选择标签进行搜索</p>
          </div>
        )}
      </main>
    </div>
  );
}
