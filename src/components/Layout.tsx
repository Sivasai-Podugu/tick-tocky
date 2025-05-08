import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Clock, History } from 'lucide-react';

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            TimerFlow
          </h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <nav className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-12">
            <Link 
              to="/" 
              className={`flex flex-col items-center p-2 ${
                pathname === '/' 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm mt-1">Timers</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex flex-col items-center p-2 ${
                pathname === '/history' 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <History className="h-6 w-6" />
              <span className="text-sm mt-1">History</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;