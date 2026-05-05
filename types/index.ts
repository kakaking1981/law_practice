export interface LawCard {
  id: string;
  title: string;
  content: string;
  analysis: string[];
  tags: string[];
  category: string;
  subcategory: string;
  chapter: string;
  createdAt: string;
  readCount: number;
  lastReadAt: string | null;
  masteryLevel: number;
  isRead: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count?: number;
  readCount?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  count: number;
}
