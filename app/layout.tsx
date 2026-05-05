'use client';

import './globals.css';
import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CardProvider } from '@/context/CardContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          <CardProvider>
            <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">加载中...</div>}>
              {children}
            </Suspense>
          </CardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
