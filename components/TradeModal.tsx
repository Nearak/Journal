
import React, { useState } from 'react';
import { Trade, Position, TradeResult } from '../types';

interface TradeModalProps {
  onClose: () => void;
  onAddTrade: (trade: Trade) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ onClose, onAddTrade }) => {
  const [trade, setTrade] = useState<Omit<Trade, 'id' | 'amount'>>({
    date: new Date().toISOString().split('T')[0],
    currencyPair: '',
    tradeType: '',
    position: Position.Buy,
    notes: '',
    emotions: '',
    result: TradeResult.Profit,
  });
  const [amountStr, setAmountStr] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrade(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (!trade.currencyPair || !trade.tradeType || isNaN(amount)) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح.');
      return;
    }
    
    const finalAmount = trade.result === TradeResult.Loss ? -Math.abs(amount) : Math.abs(amount);

    onAddTrade({
      ...trade,
      id: new Date().getTime().toString(),
      amount: finalAmount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h3 className="text-2xl font-bold text-white">إضافة صفقة جديدة</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">تاريخ الصفقة</label>
              <input type="date" name="date" value={trade.date} onChange={handleChange} className="input-style" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">زوج العملات</label>
              <input type="text" name="currencyPair" placeholder="مثال: EURUSD" value={trade.currencyPair} onChange={handleChange} className="input-style" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">نوع الصفقة</label>
              <input type="text" name="tradeType" placeholder="مثال: Scalping" value={trade.tradeType} onChange={handleChange} className="input-style" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">المركز (شراء/بيع)</label>
              <select name="position" value={trade.position} onChange={handleChange} className="input-style">
                <option value={Position.Buy}>شراء</option>
                <option value={Position.Sell}>بيع</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">نتيجة الصفقة</label>
              <select name="result" value={trade.result} onChange={handleChange} className="input-style">
                <option value={TradeResult.Profit}>ربح</option>
                <option value={TradeResult.Loss}>خسارة</option>
                <option value={TradeResult.Breakeven}>تعادل</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">مبلغ الربح/الخسارة ($)</label>
              <input type="number" name="amount" placeholder="مثال: 150.50" value={amountStr} onChange={e => setAmountStr(e.target.value)} className="input-style" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">المشاعر أثناء الصفقة</label>
              <input type="text" name="emotions" placeholder="مثال: ثقة، تردد، طمع..." value={trade.emotions} onChange={handleChange} className="input-style" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">ملاحظات</label>
              <textarea name="notes" placeholder="اكتب ملاحظاتك هنا..." value={trade.notes} onChange={handleChange} className="input-style h-24"></textarea>
            </div>
          </div>
          <div className="p-6 bg-gray-800/50 flex justify-end gap-4 sticky bottom-0">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              إلغاء
            </button>
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              حفظ الصفقة
            </button>
          </div>
        </form>
      </div>
       <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.75rem;
          background-color: #374151;
          border: 1px solid #4B5563;
          border-radius: 0.5rem;
          color: #F3F4F6;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: #2dd4bf;
          box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.5);
        }
      `}</style>
    </div>
  );
};

export default TradeModal;
