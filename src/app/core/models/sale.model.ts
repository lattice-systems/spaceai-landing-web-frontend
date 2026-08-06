export interface SaleResponse {
  id: string;
  quoteId: string;
  institutionName: string;
  requesterName: string;
  total: number;
  /** Costo de los módulos vendidos, congelado al costo promedio ponderado de la conversión. */
  totalCost: number;
  grossProfit: number;
  /** grossProfit / total * 100. */
  marginPercent: number;
  status: string;
  createdAt: string;
}

export interface MonthlyProfitability {
  /** "yyyy-MM". */
  month: string;
  salesCount: number;
  revenue: number;
  cost: number;
  grossProfit: number;
  marginPercent: number;
}

export interface SalesProfitability {
  salesCount: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  marginPercent: number;
  byMonth: MonthlyProfitability[];
}
