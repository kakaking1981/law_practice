'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LawCard } from '@/types';
import { subcategories } from '@/data/cards';

// 辅助函数：获取子类目名称
const getSubcategoryName = (sub: string): string => {
  const predefined = subcategories.find(s => s.id === sub);
  return predefined ? predefined.name : sub;
};

// 辅助函数：检查是否匹配（名称或ID都算匹配）
const matchesSubcategory = (cardSub: string, targetSub: string): boolean => {
  if (cardSub === targetSub) return true;
  const predefined = subcategories.find(s => s.id === targetSub || s.name === targetSub);
  if (predefined) {
    return cardSub === predefined.id || cardSub === predefined.name;
  }
  return false;
};

interface CardContextType {
  cards: LawCard[];
  loading: boolean;
  updateCard: (id: string, updates: Partial<LawCard>) => void;
  addCard: (card: Omit<LawCard, 'id' | 'createdAt' | 'readCount' | 'lastReadAt' | 'isRead'>) => void;
  deleteCard: (id: string) => void;
  searchCards: (query: string) => LawCard[];
  getCardsByCategory: (categoryId: string) => LawCard[];
  getCardsBySubcategory: (categoryId: string, subcategoryId: string) => LawCard[];
  getSubcategories: (categoryId: string) => string[];
  getStats: () => { total: number; read: number; masteryAvg: string };
  getCategoryStats: (categoryId: string) => { total: number; read: number; masteryAvg: string };
}

const CardContext = createContext<CardContextType | null>(null);

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<LawCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<LawCard>) => {
    try {
      const response = await fetch('/api/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        const updatedCard = await response.json();
        setCards(prev => prev.map(card => card.id === id ? updatedCard : card));
      }
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  const addCard = async (newCard: Omit<LawCard, 'id' | 'createdAt' | 'readCount' | 'lastReadAt' | 'isRead'>) => {
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        const createdCard = await response.json();
        setCards(prev => [createdCard, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const response = await fetch(`/api/cards?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCards(prev => prev.filter(card => card.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const searchCards = (query: string): LawCard[] => {
    if (!query.trim()) return cards;
    const lowerQuery = query.toLowerCase();
    return cards.filter(
      card =>
        card.title.toLowerCase().includes(lowerQuery) ||
        card.content.toLowerCase().includes(lowerQuery) ||
        card.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        card.analysis.some(a => a.toLowerCase().includes(lowerQuery))
    );
  };

  const getCardsByCategory = (categoryId: string): LawCard[] => {
    return cards.filter(card => card.category === categoryId);
  };

  const getCardsBySubcategory = (categoryId: string, subcategoryId: string): LawCard[] => {
    return cards.filter(card => 
      card.category === categoryId && 
      matchesSubcategory(card.subcategory, subcategoryId)
    );
  };

  const getSubcategories = (categoryId: string): string[] => {
    const categoryCards = cards.filter(card => card.category === categoryId);
    
    // 获取预定义的子类目名称
    const predefinedSubs = subcategories
      .filter(s => s.categoryId === categoryId)
      .map(s => s.name);
    
    // 获取卡片中的子类目名称（转换后）
    const cardSubs = categoryCards.map(card => getSubcategoryName(card.subcategory));
    
    // 合并并去重
    const subSet = new Set<string>([...predefinedSubs, ...cardSubs]);
    const subs = Array.from(subSet);
    
    // 排序，待定放最后
    const sortedSubs = subs.sort((a, b) => {
      if (a === '待定') return 1;
      if (b === '待定') return -1;
      return a.localeCompare(b);
    });
    
    return sortedSubs.length > 0 ? sortedSubs : ['待定'];
  };

  const getStats = () => {
    const total = cards.length;
    const read = cards.filter(c => c.isRead).length;
    const masteryCards = cards.filter(c => c.masteryLevel > 0);
    const masteryAvg = masteryCards.length > 0
      ? (masteryCards.reduce((sum, c) => sum + c.masteryLevel, 0) / masteryCards.length).toFixed(1)
      : '0';
    return { total, read, masteryAvg };
  };

  const getCategoryStats = (categoryId: string) => {
    const categoryCards = getCardsByCategory(categoryId);
    const total = categoryCards.length;
    const read = categoryCards.filter(c => c.isRead).length;
    const masteryCards = categoryCards.filter(c => c.masteryLevel > 0);
    const masteryAvg = masteryCards.length > 0
      ? (masteryCards.reduce((sum, c) => sum + c.masteryLevel, 0) / masteryCards.length).toFixed(1)
      : '0';
    return { total, read, masteryAvg };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <CardContext.Provider
      value={{
        cards,
        loading,
        updateCard,
        addCard,
        deleteCard,
        searchCards,
        getCardsByCategory,
        getCardsBySubcategory,
        getSubcategories,
        getStats,
        getCategoryStats,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within CardProvider');
  }
  return context;
}
