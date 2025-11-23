
export enum Position {
  Buy = 'شراء',
  Sell = 'بيع',
}

export enum TradeResult {
  Profit = 'ربح',
  Loss = 'خسارة',
  Breakeven = 'تعادل',
}

export interface Trade {
  id: string;
  date: string;
  currencyPair: string;
  tradeType: string;
  position: Position;
  notes: string;
  emotions: string;
  result: TradeResult;
  amount: number;
}
