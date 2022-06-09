export interface AccountInterface {
  id: string,
  playerId: string,
  formatBalance: {
    currency: string,
    amount: string
  },
  status: number
}

export interface AccountRequestInterface {
  accountId: string,
  currency: string,
}
