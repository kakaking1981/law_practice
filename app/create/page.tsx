'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCards } from '@/context/CardContext';
import { ArrowLeft, Save, Hash, BookMarked, Plus, ChevronDown } from 'lucide-react';

const PREDEFINED_CATEGORIES = ['民法', '刑法', '刑诉法', '行政法', '经济法', '三国法'];

export default function CreatePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { addCard, cards } = useCards();

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    content: '',
    analysis: '',
    tags: '',
    chapter: '',
  });

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [isAddingNewSubcategory, setIsAddingNewSubcategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newSubcategoryInput, setNewSubcategoryInput] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  useEffect(() => {
    if (formData.category && formData.category !== '新增科目') {
      const subs = cards
        .filter(card => card.category === formData.category)
        .map(card => card.subcategory);
      const uniqueSubs = Array.from(new Set(subs));
      setAvailableSubcategories(uniqueSubs.length > 0 ? uniqueSubs : []);
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.category, cards]);

  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagRegex = /#(\S+)/g;
    const extractedTags: string[] = [];
    let match;
    while ((match = tagRegex.exec(formData.tags)) !== null) {
      extractedTags.push(match[1]);
    }

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

  const handleCategoryChange = (value: string) => {
    if (value === '新增科目') {
      setIsAddingNewCategory(true);
      setFormData(prev => ({ ...prev, category: '', subcategory: '' }));
    } else {
      setIsAddingNewCategory(false);
      setNewCategoryInput('');
      setFormData(prev => ({ ...prev, category: value, subcategory: '' }));
    }
  };

  const handleSubcategoryChange = (value: string) => {
    if (value === '新增子类目') {
      setIsAddingNewSubcategory(true);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    } else {
      setIsAddingNewSubcategory(false);
      setNewSubcategoryInput('');
      setFormData(prev => ({ ...prev, subcategory: value }));
    }
  };

  const handleNewCategoryConfirm = () => {
    if (newCategoryInput.trim()) {
      setFormData(prev => ({ ...prev, category: newCategoryInput.trim() }));
      setIsAddingNewCategory(false);
    }
  };

  const handleNewSubcategoryConfirm = () => {
    if (newSubcategoryInput.trim()) {
      setFormData(prev => ({ ...prev, subcategory: newSubcategoryInput.trim() }));
      setIsAddingNewSubcategory(false);
    }
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
            {!isAddingNewCategory ? (
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">请选择科目</option>
                  {PREDEFINED_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="新增科目">+ 新增科目</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="输入新科目名称"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleNewCategoryConfirm}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  确认
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewCategory(false);
                    setNewCategoryInput('');
                  }}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">子类目</label>
            {!isAddingNewSubcategory ? (
              <div className="relative">
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  disabled={!formData.category}
                >
                  <option value="">请选择子类目（可选）</option>
                  {availableSubcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="新增子类目">+ 新增子类目</option>
                  {formData.category && (
                    <option value="待定">待定</option>
                  )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategoryInput}
                  onChange={(e) => setNewSubcategoryInput(e.target.value)}
                  placeholder="输入新子类目名称"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleNewSubcategoryConfirm}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  确认
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewSubcategory(false);
                    setNewSubcategoryInput('');
                  }}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            )}
            {!formData.category && (
              <p className="text-xs text-gray-500 mt-1">请先选择科目</p>
            )}
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
