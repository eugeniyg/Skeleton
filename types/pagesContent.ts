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
  pageUrl: string,
  title: string,
  icon: string,
  questionList: QuestionInterface[],
  position?: number
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

export interface BenefitItemInterface {
  image: string,
  title: string,
}

export interface BenefitsContentInterface {
  icon: string,
  label: string,
  items: BenefitItemInterface[],
}

export interface PromotionItemInterface {
  image: string,
  title: string,
  description: string,
  buttonLabel: string,
  link: {
    label: string,
    url: string
  }
}

export interface PromotionsContentInterface {
  icon: string,
  label: string,
  items: PromotionItemInterface[]
}

export interface CategoryInterface {
  image: string,
  icon: string,
  title: string,
  description: string,
  button: {
    label: string,
    url: string
  }
}

export interface HomeContentInterface {
  banner: {
    image: {
      mobile: {
        backgroundImage: string,
        faceImage: string
      },
      desktop: {
        backgroundImage: string,
        faceImage: string
      }
    },
    title: string,
    content?: string,
    button: {
      label: string,
      url?: string
    }
  },
  categories: {
    casino: CategoryInterface,
    sports: CategoryInterface
  }
}

export interface GameCategoryInterface {
  icon: string,
  identity: string,
  label: string
}

export interface CardsGroupInterface {
  moreButton: string,
  demoButton: string,
  favorites: {
    icon: string,
    label: string
  },
  providers: {
    icon: string,
    label: string
  },
  latestWinners: {
    icon: string,
    label: string
  }
}

export interface GlobalComponentsInterface {
  benefits: BenefitsContentInterface,
  promotions: PromotionsContentInterface,
  cardsGroup: CardsGroupInterface,
  categories: GameCategoryInterface[]
}
