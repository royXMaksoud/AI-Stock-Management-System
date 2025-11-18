import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  FileText, 
  Settings, 
  ScanBarcode,
  Bell,
  Search,
  Sparkles
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AIAssistant from './pages/AIAssistant';

// Sidebar Navigation Component
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/inventory', label: 'Inventory', icon: <Package size={20} /> },
    { path: '/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { path: '/shipments', label: 'Shipments', icon: <Truck size={20} /> },
    { path: '/suppliers', label: 'Suppliers', icon: <Users size={20} /> },
    { path: '/ai-assistant', label: 'AI Assistant', icon: <Sparkles size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={20} /> },
    { path: '/scan', label: 'Barcode Scan', icon: <ScanBarcode size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          N
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Nexus WMS</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2 tracking-wider">Main Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.path === '/ai-assistant' && (
              <span className="ml-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>
            )}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <img 
            src="https://picsum.photos/100/100?random=user" 
            alt="Admin" 
            className="w-8 h-8 rounded-full border border-slate-600"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Alexander Doe</p>
            <p className="text-xs text-slate-500 truncate">Warehouse Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 ml-64">
      <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200 w-96 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search orders, SKUs, or shipments..." 
          className="bg-transparent border-none focus:ring-0 text-sm text-slate-700 w-full ml-2"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           System Operational
        </div>
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};

// Main App Layout
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        
        <div className="ml-64 min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              {/* Placeholders for other routes */}
              <Route path="*" element={<div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Package size={48} className="mb-4 opacity-20" />
                <p>Module under construction</p>
              </div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
