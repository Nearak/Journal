import React, { useMemo } from 'react';
import { Trade, TradeResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsProps {
  trades: Trade[];
}

// Fix: Display positive value for loss and safely access payload properties.
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded">
        <p className="label">{`${label}`}</p>
        <p className="text-teal-400">{`ربح: ${(payload[0]?.value || 0).toLocaleString()}`}</p>
        <p className="text-red-400">{`خسارة: ${Math.abs(payload[1]?.value || 0).toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const StatCard: React.FC<{ title: string, value: string | number, colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-gray-400 text-md font-semibold">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{value}</p>
    </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ trades }) => {
  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === TradeResult.Profit).length;
    const losses = trades.filter(t => t.result === TradeResult.Loss).length;
    const breakeven = totalTrades - wins - losses;

    const totalProfit = trades.filter(t => t.result === TradeResult.Profit).reduce((sum, t) => sum + t.amount, 0);
    // Note: totalLoss will be a negative number or zero, as loss amounts are stored as negative.
    const totalLoss = trades.filter(t => t.result === TradeResult.Loss).reduce((sum, t) => sum + t.amount, 0);
    
    // Fix: Prevent division by zero if there are no wins or losses.
    const winRate = (wins + losses) > 0 ? ((wins / (wins + losses)) * 100) : 0;
    // Fix: Correctly calculate net PnL. Since totalLoss is negative, we add it to totalProfit.
    const netPnl = totalProfit + totalLoss;
    // Fix: Correctly calculate profit factor. Guard against division by zero and use the absolute value of totalLoss.
    const profitFactor = totalLoss < 0 ? (totalProfit / -totalLoss) : 0;

    return { totalTrades, wins, losses, breakeven, totalProfit, totalLoss, winRate, netPnl, profitFactor };
  }, [trades]);

  const pnlByPair = useMemo(() => {
    const data: { [key: string]: { name: string, profit: number, loss: number } } = {};
    trades.forEach(trade => {
        if (!data[trade.currencyPair]) {
            data[trade.currencyPair] = { name: trade.currencyPair, profit: 0, loss: 0 };
        }
        if (trade.result === TradeResult.Profit) {
            data[trade.currencyPair].profit += trade.amount;
        } else if (trade.result === TradeResult.Loss) {
            // Keep loss as a negative value for the stacked bar chart to correctly calculate net value.
            data[trade.currencyPair].loss += trade.amount;
        }
    });
    return Object.values(data);
  }, [trades]);

  const resultDistribution = useMemo(() => [
    { name: 'ربح', value: stats.wins },
    { name: 'خسارة', value: stats.losses },
    { name: 'تعادل', value: stats.breakeven },
  ], [stats]);

  const COLORS = ['#2dd4bf', '#f87171', '#60a5fa'];

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-gray-200">لوحة التحكم والإحصائيات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="إجمالي الصفقات" value={stats.totalTrades} colorClass="text-blue-400" />
        <StatCard title="صافي الربح/الخسارة" value={`$${stats.netPnl.toLocaleString()}`} colorClass={stats.netPnl >= 0 ? 'text-teal-400' : 'text-red-400'} />
        <StatCard title="معدل النجاح" value={`${stats.winRate.toFixed(2)}%`} colorClass="text-yellow-400" />
        <StatCard title="عامل الربح" value={stats.profitFactor.toFixed(2)} colorClass="text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">الربح/الخسارة حسب زوج العملات</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={pnlByPair} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
              <Legend />
              <Bar dataKey="profit" name="ربح" fill="#2dd4bf" stackId="a" />
              <Bar dataKey="loss" name="خسارة" fill="#f87171" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">توزيع النتائج</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={resultDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                // Fix: Explicitly cast `percent` to a number to resolve the TypeScript error about arithmetic operations.
                label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}
              >
                {resultDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} صفقات`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
