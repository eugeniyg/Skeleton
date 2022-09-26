export interface SeoContentInterface {
  title?: string,
  description?: string,
  text?: {
    visible?: string,
    hidden?: string,
    button?: string
  }
}

export interface StaticPageInterface {
  pageUrl: string,
  content: string,
  seo: SeoContentInterface
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
  description: string,
  seo: SeoContentInterface
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

export interface QuestionPagesInterface {
  title: string,
  seo: SeoContentInterface
}

export interface ProfileInfoInterface {
  title: string,
  editButton: string,
  saveButton: string,
  cancelButton: string,
  subscriptionTitle: string,
  manageTitle: string,
  seo: SeoContentInterface
}

export interface ProfileWalletInterface {
  title: string,
  addButton: string,
  allTab: string,
  cryptoTab: string,
  changeButton: string,
  hideButton: string,
  depositButton: string,
  withdrawButton: string,
  seo: SeoContentInterface
}

export interface ProfileBonusesInterface {
  title: string,
  seo: SeoContentInterface
}

export interface ProfileNotificationsInterface {
  title: string,
  seo: SeoContentInterface
}

export interface ProfileSecurityInterface {
  title: string,
  saveButton: string,
  seo: SeoContentInterface
}

export interface ProfileHistoryInterface {
  title: string,
  seo: SeoContentInterface
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
  tableColumns: {
    game: string,
    bet: string,
    result: string,
    date: string
  },
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
  seo: SeoContentInterface
}

export interface MainContentInterface {
  seo: SeoContentInterface
}

export interface GameCategoryInterface {
  icon: string,
  identity: string,
  label: string
}

export interface CardsGroupInterface {
  moreButton: string,
  demoButton: string,
  recommendedSubtitle: string
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

export interface FavoritesPageInterface {
  title: string,
  empty: {
    image: string,
    title: string,
    description: string
  },
  seo: SeoContentInterface
}

export interface RecentlyPageInterface {
  title: string,
  empty: {
    image: string,
    title: string,
    description: string
  },
  seo: SeoContentInterface
}

export interface ContactPageInterface {
  image: string,
  title: string,
  description: string,
  buttonLabel: string,
  seo: SeoContentInterface
}

interface WelcomeItemInterface {
  topLabel: string,
  image: string,
  title: string,
  buttonLabel: string,
  link: {
    label: string,
    url: string
  }
}

interface BonusesItemInterface {
  title: string,
  subtitle: string,
  image: string,
  buttonLabel: string,
  link: {
    label: string,
    url: string
  }
}

export interface WelcomePageInterface {
  title: string,
  description: string,
  howGet: {
    label: string,
    first: string,
    second: string,
    third: string,
    image: string
  },
  welcome: {
    label: string,
    items: WelcomeItemInterface[]
  },
  bonuses: {
    label: string,
    items: BonusesItemInterface[]
  },
  seo: SeoContentInterface
}

export interface GamePageInterface {
  realLabel: string,
  realButton: string,
  demoLabel: string,
  demoButton: string,
  switcherLabel: string,
  plug: {
    title: string,
    image: string,
    description: string
  },
  seo: SeoContentInterface
}

export interface SortOptionInterface {
  label: string,
  sortBy: string,
  sortOrder: string
}

export interface CategoryGamesInterface {
  empty: {
    image: string,
    title: string,
    description: string
  },
  providersLabel: string,
  sortLabel: string,
  sortOptions: SortOptionInterface[],
  seo: SeoContentInterface
}

export interface ErrorPageInterface {
  title: string,
  description: string,
  button: {
    label: string,
    url: string
  }
}

export interface BettingContentInterface {
  plug: {
    image: string,
    description: string
  },
  seo: SeoContentInterface
}

export interface TokenContentInterface {
  seo: SeoContentInterface
}

export interface TurboItemInterface {
  url: string,
  image: string,
  title: string,
  infoValue: string,
  categoryValue: string
}

export interface TurbogamesGroupInterface {
  label: string,
  icon: string,
  buttonLabel: string,
  infoLabel: string,
  categoryLabel: string,
  items: TurboItemInterface[]
}

export interface GlobalComponentsInterface {
  benefits: BenefitsContentInterface,
  promotions: PromotionsContentInterface,
  cardsGroup: CardsGroupInterface,
  categories: GameCategoryInterface[],
  turbogames: TurbogamesGroupInterface,
  globalSeo: SeoContentInterface
}
