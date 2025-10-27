import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { ChatBot } from '@/components/chatbot/ChatBot';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border mt-16">
          <Sidebar />
        </aside>
        <main className="flex-1 ml-64 p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatBot />
    </div>
  );
}