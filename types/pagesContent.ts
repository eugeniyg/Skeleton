export interface StaticPageInterface {
  pageUrl: string,
  content: string
}

export interface BonusPageInterface {
  pageUrl: string,
  termsLabel: string,
  termsContent: string,
  button: {
    label: string
    url?: string
  },
  backgroundColor: string,
  subtitle: string,
  title: string,
  image: string,
  description: string
}

export interface QuestionInterface {
  question: string,
  answer: string,
}

export interface QuestionPageInterface {
  generalTitle: string,
  pageUrl: string,
  title: string,
  icon: string,
  questionList: QuestionInterface[]
}

export interface ProfileInfoInterface {
  title: string,
  editButton: string,
  saveButton: string,
  cancelButton: string,
  subscriptionTitle: string,
  manageTitle: string
}

export interface ProfileWalletInterface {
  title: string,
  addButton: string,
  allTab: string,
  cryptoTab: string,
  changeButton: string,
  hideButton: string,
  depositButton: string,
  withdrawButton: string
}

export interface ProfileBonusesInterface {
  title: string
}

export interface ProfileNotificationsInterface {
  title: string
}

export interface ProfileSecurityInterface {
  title: string,
  saveButton: string
}

export interface ProfileHistoryInterface {
  title: string
}

export interface ProfileContentInterface {
  info: ProfileInfoInterface,
  wallet: ProfileWalletInterface,
  bonuses: ProfileBonusesInterface,
  notifications: ProfileNotificationsInterface,
  security: ProfileSecurityInterface,
  history: ProfileHistoryInterface
}

export interface HistoryBonusesInterface {
  empty: {
    icon: string,
    title?: string,
    description?: string
  },
  tabLabel: string
}

export interface HistoryBetsInterface {
  empty: {
    icon: string,
    title?: string,
    description?: string
  },
  tabLabel: string
}

export interface HistoryTransactionsInterface {
  empty: {
    icon: string,
    title?: string,
    description?: string
  },
  tabLabel: string
  dateLabel: string,
  allFilterOption: string,
  typeFilter: {
    label: string,
    options: {
      deposit: string,
      withdrawal: string
    }
  },
  currencyLabel: string,
  statusFilter: {
    label: string,
    options: {
      review: string,
      pending: string,
      success: string,
      rejected: string
    }
  },
  tableColumns: {
    date: string,
    type: string,
    method: string,
    status: string,
    sum: string
  }
  cancelPaymentButton: string,
}

export interface HistorySessionsInterface {
  tabLabel: string,
  tableColumns: {
    country: string,
    userAgent: string,
    createdAt: string,
    status: string
  },
  sessionsStatuses: {
    current: string,
    active: string,
    closed: string
  }
}

export interface HistoryTabInterface {
  bonuses: HistoryBonusesInterface,
  bets: HistoryBetsInterface,
  transactions: HistoryTransactionsInterface,
  sessions: HistorySessionsInterface,
}
