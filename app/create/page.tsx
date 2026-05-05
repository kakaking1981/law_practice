'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCards } from '@/context/CardContext';
import { ArrowLeft, Save, Hash, BookMarked } from 'lucide-react';

export default function CreatePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { addCard } = useCards();

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    content: '',
    analysis: '',
    tags: '',
    chapter: '',
  });

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 解析标签（#tag格式）
    const tagRegex = /#(\S+)/g;
    const extractedTags: string[] = [];
    let match;
    while ((match = tagRegex.exec(formData.tags)) !== null) {
      extractedTags.push(match[1]);
    }

    // 解析核心知识点（按行分割）
    const analysisPoints = formData.analysis
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    addCard({
      title: formData.title || formData.content.substring(0, 30) + '...',
      content: formData.content,
      analysis: analysisPoints,
      tags: extractedTags,
      category: formData.category,
      subcategory: formData.subcategory || '待定',
      chapter: formData.chapter,
      masteryLevel: 0,
    });

    router.push('/library');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">录入新卡片</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">科目</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="输入科目名称（如：民法、刑法）"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">子类目</label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
              placeholder="输入子类目名称（可选，默认：待定）"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标题（可选）</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="案件名称或简要概括"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <BookMarked className="w-4 h-4 mr-2" />
                案情概要
              </span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="请输入案情描述..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">核心知识点</label>
            <textarea
              value={formData.analysis}
              onChange={(e) => setFormData(prev => ({ ...prev, analysis: e.target.value }))}
              placeholder="每行输入一个核心知识点..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">每行一个知识点，自动编号</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                标签
              </span>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="#标签1 #标签2 #标签3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">使用 #标签名 格式，空格分隔</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">知识地图</label>
            <input
              type="text"
              value={formData.chapter}
              onChange={(e) => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
              placeholder="例如：物权法 - 物权变动"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">多个路径用分号隔开</p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>保存卡片</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
