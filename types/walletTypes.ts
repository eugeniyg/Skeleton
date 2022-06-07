export interface AccountInterface {
  id: string,
  playerId: string,
  formatBalance: {
    currency: string,
    amount: string
  },
  status: number
}
