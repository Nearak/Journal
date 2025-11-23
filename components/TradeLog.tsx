import React, { useState, useMemo } from 'react';
import { Trade, Position, TradeResult } from '../types';
import TradeModal from './TradeModal';
import { PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';

interface TradeLogProps {
  trades: Trade[];
  onAddTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
}

const TradeLog: React.FC<TradeLogProps> = ({ trades, onAddTrade, onDeleteTrade }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    currencyPair: '',
    position: 'all',
    result: 'all',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Trade; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const requestSort = (key: keyof Trade) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedTrades = useMemo(() => {
    let filteredTrades = [...trades].filter(trade => {
      const currencyPairMatch = trade.currencyPair.toLowerCase().includes(filters.currencyPair.toLowerCase());
      const positionMatch = filters.position === 'all' || trade.position === filters.position;
      const resultMatch = filters.result === 'all' || trade.result === filters.result;
      return currencyPairMatch && positionMatch && resultMatch;
    });

    if (sortConfig !== null) {
      filteredTrades.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            comparison = aVal - bVal;
        } else {
            comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }

    return filteredTrades;
  }, [trades, filters, sortConfig]);

  const SortableHeader: React.FC<{ label: string; columnKey: keyof Trade }> = ({ label, columnKey }) => {
    const isSorted = sortConfig?.key === columnKey;
    return (
      <th className="p-4 font-semibold text-gray-300">
        <button onClick={() => requestSort(columnKey)} className="flex items-center gap-2 hover:text-white transition-colors group">
          <span className="group-hover:text-teal-300">{label}</span>
          {isSorted && (sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
        </button>
      </th>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-200">سجل الصفقات</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-5 rounded-lg transition-colors"
        >
          <PlusIcon />
          <span>إضافة صفقة جديدة</span>
        </button>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-gray-800/50 p-4 rounded-xl">
        <input 
          type="text" 
          name="currencyPair"
          placeholder="فلترة حسب زوج العملات..." 
          value={filters.currencyPair}
          onChange={handleFilterChange}
          className="filter-input flex-grow"
        />
        <select name="position" value={filters.position} onChange={handleFilterChange} className="filter-input">
            <option value="all">كل المراكز</option>
            <option value={Position.Buy}>شراء</option>
            <option value={Position.Sell}>بيع</option>
        </select>
        <select name="result" value={filters.result} onChange={handleFilterChange} className="filter-input">
            <option value="all">كل النتائج</option>
            <option value={TradeResult.Profit}>ربح</option>
            <option value={TradeResult.Loss}>خسارة</option>
            <option value={TradeResult.Breakeven}>تعادل</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-700/50">
              <tr>
                <SortableHeader label="التاريخ" columnKey="date" />
                <SortableHeader label="زوج العملات" columnKey="currencyPair" />
                <th className="p-4 font-semibold text-gray-300">المركز</th>
                <th className="p-4 font-semibold text-gray-300">النتيجة</th>
                <SortableHeader label="المبلغ" columnKey="amount" />
                <th className="p-4 font-semibold text-gray-300">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTrades.length > 0 ? (
                filteredAndSortedTrades.map((trade, index) => (
                  <tr key={trade.id} className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                    <td className="p-4 text-gray-300">{trade.date}</td>
                    <td className="p-4 text-gray-300 font-mono">{trade.currencyPair}</td>
                    <td className={`p-4 font-semibold ${trade.position === 'شراء' ? 'text-teal-400' : 'text-red-400'}`}>{trade.position}</td>
                    <td className={`p-4 font-semibold ${
                      trade.result === 'ربح' ? 'text-teal-400' : 
                      trade.result === 'خسارة' ? 'text-red-400' : 'text-blue-400'
                    }`}>{trade.result}</td>
                    <td className={`p-4 font-semibold ${trade.amount >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                      {trade.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className="p-4">
                      <button onClick={() => onDeleteTrade(trade.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500 text-lg">
                    لا توجد صفقات تطابق معايير الفلترة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TradeModal
          onClose={() => setIsModalOpen(false)}
          onAddTrade={onAddTrade}
        />
      )}
       <style>{`
        .filter-input {
          padding: 0.5rem 0.75rem;
          background-color: #374151;
          border: 1px solid #4B5563;
          border-radius: 0.5rem;
          color: #F3F4F6;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .filter-input:focus {
          outline: none;
          border-color: #2dd4bf;
          box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.5);
        }
      `}</style>
    </div>
  );
};

export default TradeLog;