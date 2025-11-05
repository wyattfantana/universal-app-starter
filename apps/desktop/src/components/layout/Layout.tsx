import { useState } from 'react';
import Dashboard from '../dashboard/Dashboard';
import ClientList from '../clients/ClientList';

type Page = 'dashboard' | 'clients' | 'estimates' | 'invoices' | 'products' | 'settings';

export default function Layout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
    { id: 'clients' as Page, label: 'Clients', icon: '👥' },
    { id: 'estimates' as Page, label: 'Estimates', icon: '📝' },
    { id: 'invoices' as Page, label: 'Invoices', icon: '🧾' },
    { id: 'products' as Page, label: 'Products', icon: '📦' },
    { id: 'settings' as Page, label: 'Settings', icon: '⚙️' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'clients':
        return <ClientList />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
            <p className="text-gray-600">This page is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-brand-600">QuoteMaster</h1>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
                      currentPage === item.id
                        ? 'bg-brand-100 text-brand-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
