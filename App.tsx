
import React, { useState, useEffect, useCallback } from 'react';
import { Trade } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [trades, setTrades] = useState<Trade[]>(() => {
    try {
      const savedTrades = localStorage.getItem('trades');
      return savedTrades ? JSON.parse(savedTrades) : [];
    } catch (error) {
      console.error("Could not parse trades from localStorage", error);
      return [];
    }
  });
  const [initialCapital, setInitialCapital] = useState<number>(() => {
    try {
      const savedCapital = localStorage.getItem('initialCapital');
      return savedCapital ? JSON.parse(savedCapital) : 10000;
    } catch (error) {
      console.error("Could not parse initial capital from localStorage", error);
      return 10000;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trades', JSON.stringify(trades));
    } catch (error) {
      console.error("Could not save trades to localStorage", error);
    }
  }, [trades]);

  useEffect(() => {
    try {
      localStorage.setItem('initialCapital', JSON.stringify(initialCapital));
    } catch (error) {
      console.error("Could not save initial capital to localStorage", error);
    }
  }, [initialCapital]);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const addTrade = useCallback((trade: Trade) => {
    setTrades(prevTrades => [...prevTrades, trade]);
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));
  }, []);

  const updateInitialCapital = useCallback((amount: number) => {
    setInitialCapital(amount);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      trades={trades}
      initialCapital={initialCapital}
      onAddTrade={addTrade}
      onDeleteTrade={deleteTrade}
      onUpdateInitialCapital={updateInitialCapital}
      onLogout={handleLogout}
    />
  );
};

export default App;
