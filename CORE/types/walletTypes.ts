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

export interface PaymentMethodInterface {
  method: string,
  amountMin: number,
  amountMax: number,
  names: any,
  logo: string,
  icon: string,
  fields: any[],
}

export interface RequestDepositInterface {
  method: string,
  fields?: { key: string, value: string }[],
  currency: string,
  amount: number,
  accountId: string,
  redirectSuccessUrl: string,
  redirectErrorUrl: string,
}

export interface RequestWithdrawInterface {
  method: string,
  fields?: { key: string, value: string }[],
  currency: string,
  amount: number,
  accountId: string,
}

export interface ResponseDepositInterface {
  action: string,
  method: string,
  fields: any[],
}

export interface ResponseWithdrawInterface {
  method: string,
  fields: any[],
  currency: string,
  amount: number,
  accountId: string,
}
