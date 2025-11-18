import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Download } from 'lucide-react';
import { InventoryItem, StockStatus } from '../types';

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-001',
    sku: 'DX-400-XL',
    name: 'Industrial Steel Rack',
    category: 'Storage',
    quantity: 145,
    location: 'Zone A-12',
    status: StockStatus.IN_STOCK,
    lastUpdated: '2023-10-15',
    imageUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 'INV-002',
    sku: 'PL-2000',
    name: 'Heavy Duty Pallet',
    category: 'Logistics',
    quantity: 12,
    location: 'Zone B-04',
    status: StockStatus.LOW_STOCK,
    lastUpdated: '2023-10-14',
    imageUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'INV-003',
    sku: 'FK-LIFT-X',
    name: 'Forklift Battery Pack',
    category: 'Equipment',
    quantity: 0,
    location: 'Zone C-01',
    status: StockStatus.OUT_OF_STOCK,
    lastUpdated: '2023-10-10',
    imageUrl: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: 'INV-004',
    sku: 'PKG-BOX-M',
    name: 'Cardboard Box Medium',
    category: 'Packaging',
    quantity: 5000,
    location: 'Zone D-22',
    status: StockStatus.IN_STOCK,
    lastUpdated: '2023-10-16',
    imageUrl: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: 'INV-005',
    sku: 'SCN-HND-01',
    name: 'Handheld Barcode Scanner',
    category: 'Electronics',
    quantity: 45,
    location: 'Zone E-05',
    status: StockStatus.IN_STOCK,
    lastUpdated: '2023-10-16',
    imageUrl: 'https://picsum.photos/200/200?random=5'
  },
];

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = MOCK_INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK: return 'bg-emerald-100 text-emerald-700';
      case StockStatus.LOW_STOCK: return 'bg-amber-100 text-amber-700';
      case StockStatus.OUT_OF_STOCK: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, SKU..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Item Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Location</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Quantity</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 text-slate-600">{item.location}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                No inventory items found matching your search.
            </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
