'use client';

import { useState, useEffect } from 'react';
import { useCards } from '@/context/CardContext';
import { LawCard as LawCardType } from '@/types';
import { subcategories } from '@/data/cards';
import { Eye, Star, Clock, Tag, Edit2, Trash2, Check, Map, ChevronDown } from 'lucide-react';

// 辅助函数：获取子类目名称
const getSubcategoryName = (sub: string): string => {
  const predefined = subcategories.find(s => s.id === sub);
  return predefined ? predefined.name : sub;
};

// 辅助函数：获取科目的预定义子类目名称
const getPredefinedSubcategoryNames = (categoryId: string): string[] => {
  return subcategories
    .filter(sub => sub.categoryId === categoryId)
    .map(sub => sub.name);
};

// 辅助函数：获取子类目ID对应的名称
const getSubcategoryIdToName = (sub: string): string => {
  const predefined = subcategories.find(s => s.id === sub);
  return predefined ? predefined.name : sub;
};

// 辅助函数：查找子类目名称对应的ID
const findSubcategoryId = (categoryId: string, subName: string): string => {
  const predefinedSub = subcategories.find(
    s => s.categoryId === categoryId && s.name === subName
  );
  return predefinedSub ? predefinedSub.id : subName;
};

interface LawCardProps {
  card: LawCardType;
}

export default function LawCard({ card }: LawCardProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    content: card.content,
    analysis: card.analysis.join('\n'),
    tags: card.tags.map(t => `#${t}`).join(' '),
    chapter: card.chapter,
    subcategory: getSubcategoryIdToName(card.subcategory),
  });
  const { updateCard, deleteCard, cards } = useCards();

  const [isAddingNewSubcategory, setIsAddingNewSubcategory] = useState(false);
  const [newSubcategoryInput, setNewSubcategoryInput] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  useEffect(() => {
    if (card.category) {
      // 获取预定义子类目名称
      const predefinedSubs = getPredefinedSubcategoryNames(card.category);

      // 获取卡片中的子类目，并转换为名称
      const cardSubs = cards
        .filter(c => c.category === card.category)
        .map(c => getSubcategoryIdToName(c.subcategory));

      // 合并预定义和卡片中的子类目，去重
      const allSubs = Array.from(new Set([...predefinedSubs, ...cardSubs]));

      // 排序，将"待定"放最后
      const sortedSubs = allSubs.sort((a, b) => {
        if (a === '待定') return 1;
        if (b === '待定') return -1;
        return a.localeCompare(b);
      });

      setAvailableSubcategories(sortedSubs);
    }
  }, [card.category, cards]);

  const handleView = () => {
    setShowAnalysis(true);
    updateCard(card.id, {
      isRead: true,
      readCount: card.readCount + 1,
      lastReadAt: new Date().toISOString()
    });
  };

  const handleMastery = (level: number) => {
    updateCard(card.id, { masteryLevel: level });
  };

  const handleClose = () => {
    setShowAnalysis(false);
    setIsEditing(false);
    setEditData({
      content: card.content,
      analysis: card.analysis.join('\n'),
      tags: card.tags.map(t => `#${t}`).join(' '),
      chapter: card.chapter,
      subcategory: getSubcategoryIdToName(card.subcategory),
    });
    setIsAddingNewSubcategory(false);
    setNewSubcategoryInput('');
  };

  const handleSaveEdit = () => {
    const analysisPoints = editData.analysis
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const tagRegex = /#(\S+)/g;
    const tagsArray: string[] = [];
    let match;
    while ((match = tagRegex.exec(editData.tags)) !== null) {
      tagsArray.push(match[1]);
    }

    // 查找子类目名称对应的ID
    let subcategoryValue = editData.subcategory || '待定';
    const predefinedSub = subcategories.find(
      s => s.categoryId === card.category && s.name === subcategoryValue
    );
    if (predefinedSub) {
      subcategoryValue = predefinedSub.id;
    }

    updateCard(card.id, {
      content: editData.content,
      analysis: analysisPoints,
      tags: tagsArray,
      chapter: editData.chapter,
      subcategory: subcategoryValue,
    });
    setIsEditing(false);
  };

  const handleSubcategoryChange = (value: string) => {
    if (value === '新增子类目') {
      setIsAddingNewSubcategory(true);
      setEditData(prev => ({ ...prev, subcategory: '' }));
    } else {
      setIsAddingNewSubcategory(false);
      setNewSubcategoryInput('');
      setEditData(prev => ({ ...prev, subcategory: value }));
    }
  };

  const handleNewSubcategoryConfirm = () => {
    if (newSubcategoryInput.trim()) {
      setEditData(prev => ({ ...prev, subcategory: newSubcategoryInput.trim() }));
      setIsAddingNewSubcategory(false);
    }
  };

  const handleDelete = () => {
    if (confirm('确定要删除这张卡片吗？')) {
      deleteCard(card.id);
    }
  };

  const chapters = card.chapter.split(';').map(c => c.trim()).filter(c => c.length > 0);

  if (showAnalysis) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white h-auto max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs px-3 py-1.5 bg-white/20 rounded-full font-medium">
            {getSubcategoryName(card.subcategory)}
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              title="编辑"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-medium">编辑</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 text-white/80 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">删除</span>
            </button>
            <button
              onClick={handleClose}
              className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <span className="text-sm font-medium">返回</span>
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">子类目</label>
              {!isAddingNewSubcategory ? (
                <div className="relative">
                  <select
                    value={editData.subcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none"
                  >
                    <option value="">请选择子类目（可选）</option>
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="新增子类目">+ 新增子类目</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubcategoryInput}
                    onChange={(e) => setNewSubcategoryInput(e.target.value)}
                    placeholder="输入新子类目名称"
                    className="flex-1 px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleNewSubcategoryConfirm}
                    className="px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-white/90"
                  >
                    确认
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewSubcategory(false);
                      setNewSubcategoryInput('');
                    }}
                    className="px-4 py-3 bg-white/20 rounded-lg hover:bg-white/30"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">案情概要</label>
              <textarea
                value={editData.content}
                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">核心分析点</label>
              <textarea
                value={editData.analysis}
                onChange={(e) => setEditData(prev => ({ ...prev, analysis: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">标签 (用空格分隔，以#开头)</label>
              <input
                type="text"
                value={editData.tags}
                onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="#标签1 #标签2"
                className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">知识地图 (用分号分隔)</label>
              <input
                type="text"
                value={editData.chapter}
                onChange={(e) => setEditData(prev => ({ ...prev, chapter: e.target.value }))}
                placeholder="第一章;第二章"
                className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 flex items-center justify-center space-x-2 px-5 py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>确认保存</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                取消编辑
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold mb-2">案情概要</h3>
              <p className="text-sm opacity-90 leading-relaxed bg-white/10 rounded-lg p-4">{card.content}</p>
            </div>

            <div className="flex items-center text-sm text-white/70">
              <Clock className="w-4 h-4 mr-2" />
              阅读次数: {card.readCount}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                核心分析点
              </h4>
              <ol className="space-y-2 text-sm">
                {card.analysis.map((point, index) => (
                  <li key={index} className="flex items-start bg-white/10 rounded-lg p-3">
                    <span className="font-bold mr-2 text-yellow-400 flex-shrink-0">{index + 1}.</span>
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ol>
            </div>

            {chapters.length > 0 && (
              <div className="pt-4 border-t border-white/20">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Map className="w-4 h-4 mr-2" />
                  知识地图
                </h4>
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <p key={index} className="text-sm text-white/80 bg-white/10 rounded-lg px-3 py-2">
                      {chapter}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  掌握度: {card.masteryLevel || '-'}
                </span>
              </div>
              <div>
                <p className="text-xs mb-3">标记掌握程度:</p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => handleMastery(level)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        card.masteryLevel === level
                          ? 'bg-yellow-400 text-yellow-900 shadow-md'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-80 flex flex-col hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
          {getSubcategoryName(card.subcategory)}
        </span>
        <span className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {card.readCount}
        </span>
      </div>

      <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">{card.title}</h3>

      <p className="flex-1 text-sm text-gray-600 line-clamp-4 mb-4">{card.content}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {card.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {tag}
          </span>
        ))}
        {card.tags.length > 3 && (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">
            +{card.tags.length - 3}
          </span>
        )}
      </div>

      <button
        onClick={handleView}
        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
      >
        <span className="flex items-center justify-center space-x-2">
          <Eye className="w-4 h-4" />
          <span>查阅分析</span>
        </span>
      </button>
    </div>
  );
}