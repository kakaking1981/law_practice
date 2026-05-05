'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LawCard } from '@/types';

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
    return cards.filter(card => card.category === categoryId && card.subcategory === subcategoryId);
  };

  const getSubcategories = (categoryId: string): string[] => {
    const categoryCards = cards.filter(card => card.category === categoryId);
    const subSet = new Set<string>();
    categoryCards.forEach(card => subSet.add(card.subcategory));
    const subs = Array.from(subSet);
    return subs.length > 0 ? subs : ['待定'];
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
