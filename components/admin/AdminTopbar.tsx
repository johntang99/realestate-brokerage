'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Bot, LogOut } from 'lucide-react';
import { AIChatPanel } from '@/components/admin/AIChatPanel';

export function AdminTopbar() {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Bot className="w-4 h-4" />
          AI Chat
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
