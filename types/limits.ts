export interface LimitInterface extends Record<string, any> {
  id: string,
  playerId: string,
  definition: number,
  status: number,
  amount: number | null,
  baseCurrencyAmount: number | null,
  currentAmount: number | null,
  baseCurrentAmount: number | null,
  currency: string | null,
  baseCurrency: string | null,
  startedAt: string | null,
  expiredAt: string | null,
  createdAt: string,
  updatedAt: string | null,
  period: string | null,
  cancelProcess: boolean
}
