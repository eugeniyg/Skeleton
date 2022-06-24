export interface AccountInterface {
  id: string,
  balance: number,
  currency: string,
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
