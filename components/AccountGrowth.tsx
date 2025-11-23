
import React, { useMemo, useState } from 'react';
import { Trade } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccountGrowthProps {
  trades: Trade[];
  initialCapital: number;
  onUpdateInitialCapital: (amount: number) => void;
}

const AccountGrowth: React.FC<AccountGrowthProps> = ({ trades, initialCapital, onUpdateInitialCapital }) => {
  const [capitalInput, setCapitalInput] = useState(initialCapital.toString());

  const accountHistory = useMemo(() => {
    const history = [{ name: 'البداية', balance: initialCapital }];
    let currentBalance = initialCapital;

    // Sort trades by date to ensure correct chronological calculation
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrades.forEach((trade, index) => {
      currentBalance += trade.amount;
      history.push({
        name: `صفقة ${index + 1}`,
        balance: currentBalance,
      });
    });
    return history;
  }, [trades, initialCapital]);

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapitalInput(e.target.value);
  };
  
  const handleCapitalUpdate = () => {
      const newCapital = parseFloat(capitalInput);
      if(!isNaN(newCapital) && newCapital > 0){
          onUpdateInitialCapital(newCapital);
      }
  };

  const totalReturn = accountHistory.length > 1 ? accountHistory[accountHistory.length - 1].balance - initialCapital : 0;
  const returnPercentage = initialCapital > 0 ? (totalReturn / initialCapital) * 100 : 0;

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-gray-200">تتبع نمو الحساب</h2>
      
      <div className="mb-8 p-6 bg-gray-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <label htmlFor="initialCapital" className="text-lg font-semibold text-gray-300">رأس المال الأولي:</label>
            <input 
                type="number"
                id="initialCapital"
                value={capitalInput}
                onChange={handleCapitalChange}
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white w-40 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button onClick={handleCapitalUpdate} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                تحديث
            </button>
        </div>
        <div className="text-center md:text-end">
            <p className="text-gray-400">العائد الإجمالي</p>
            <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                {totalReturn.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({returnPercentage.toFixed(2)}%)
            </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-[500px]">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">منحنى نمو رأس المال</h3>
        {trades.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={accountHistory}
                margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="name" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" domain={['auto', 'auto']} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }}
                labelStyle={{ color: '#d1d5db' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'الرصيد']}
                />
                <Legend />
                <Line type="monotone" dataKey="balance" name="رصيد الحساب" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-xl">أضف صفقاتك الأولى لرؤية منحنى النمو.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AccountGrowth;
