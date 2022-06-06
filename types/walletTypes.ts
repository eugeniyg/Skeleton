export interface accountInterface {
  id: string,
  playerId: string,
  formatBalance: {
    currency: string,
    amount: string
  },
  status: number
}
