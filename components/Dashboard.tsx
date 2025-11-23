import React, { useState, useEffect } from 'react';
import { Trade } from '../types';
import Analytics from './Analytics';
import AccountGrowth from './AccountGrowth';
import TradeLog from './TradeLog';
import { ChartBarIcon, ListBulletIcon, WalletIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from './icons/Icons';

interface DashboardProps {
  trades: Trade[];
  initialCapital: number;
  onAddTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onUpdateInitialCapital: (amount: number) => void;
  onLogout: () => void;
}

type View = 'dashboard' | 'trades' | 'growth';

const Dashboard: React.FC<DashboardProps> = ({ trades, initialCapital, onAddTrade, onDeleteTrade, onUpdateInitialCapital, onLogout }) => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Analytics trades={trades} />;
      case 'trades':
        return <TradeLog trades={trades} onAddTrade={onAddTrade} onDeleteTrade={onDeleteTrade} />;
      case 'growth':
        return <AccountGrowth trades={trades} initialCapital={initialCapital} onUpdateInitialCapital={onUpdateInitialCapital} />;
      default:
        return <Analytics trades={trades} />;
    }
  };

  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center p-3 my-1 rounded-lg w-full text-start text-lg transition-colors duration-200 ${
          activeView === view
            ? 'bg-teal-500/20 text-teal-300'
            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {icon}
        <span className="ms-3">{label}</span>
      </button>
    </li>
  );

  const sidebarContent = (
    <>
      <div className="flex justify-between items-center md:justify-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-teal-400">سجل المتداول</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
          <XMarkIcon />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <NavItem view="dashboard" label="لوحة التحكم" icon={<ChartBarIcon />} />
          <NavItem view="trades" label="الصفقات" icon={<ListBulletIcon />} />
          <NavItem view="growth" label="نمو الحساب" icon={<WalletIcon />} />
        </ul>
      </nav>
      <div>
        <button
          onClick={onLogout}
          className="flex items-center p-3 rounded-lg w-full text-start text-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon />
          <span className="ms-3">تسجيل الخروج</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
       {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 fixed top-0 left-0 right-0 z-20">
        <h1 className="text-xl font-bold text-teal-400">سجل المتداول</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white">
          <Bars3Icon />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 right-0 z-30 w-64 bg-gray-800 p-4 border-s border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {sidebarContent}
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden"></div>}
        
        <main className="flex-1 p-6 lg:p-10 overflow-auto pt-24 md:pt-6 lg:pt-10">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
