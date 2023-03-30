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
  sendButton: string,
  verifyButton: string,
  verifiedLabel: string,
  unverifiedLabel: string,
  saveButton: string,
  cancelButton: string,
  subscriptionTitle: string,
  manageTitle: string,
  seo: SeoContentInterface
}

export interface ProfileWalletInterface {
  title: string,
  addButton: string,
  changeButton: string,
  hideButton: string,
  depositButton: string,
  withdrawButton: string,
  seo: SeoContentInterface
}

export interface BonusCodeBlockInterface {
  title: string,
  timerText: string,
  buttonLabel: string,
  tryError: string
}

export interface ProfileBonusesInterface {
  title: string,
  historyLink: string,
  bonusCode: BonusCodeBlockInterface,
  seo: SeoContentInterface
}

export interface ProfileNotificationsInterface {
  title: string,
  seo: SeoContentInterface
}

export interface ProfileDocumentsInterface {
  moreInfo: string,
  hideText: string,
  uploadPlaceholder: string,
  uploadHint: string,
  uploadButton: string,
  uploadMore: string,
  identity: {
    label: string,
    description: string,
    identity_front: string,
    identity_back: string,
    identity_selfie_id: string
  },
  address: {
    label: string,
    description: string,
    address: string
  },
  payment: {
    label: string,
    description: string,
    payment: string
  }
}

export interface ProfileSecurityInterface {
  title: string,
  password: {
    label: string,
    saveButton: string
  },
  documents: ProfileDocumentsInterface,
  seo: SeoContentInterface
}

export interface ProfileHistoryInterface {
  title: string,
  seo: SeoContentInterface
}

export interface ProfileContentInterface extends Record<string, any>{
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

export interface HistorySpinsInterface {
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

export interface BetStatusesInterface {
  pending: string,
  won: string,
  lost: string,
  refund: string,
  cashout: string,
}

export interface BetCardInterface {
  coefficientLabel: string,
  betLabel: string,
  resultLabel: string,
  copyButton: string,
  copyTooltip: string,
  comboLabel: string,
  comboDisciplinesTooltip: string,
  comboBetsLabel: string
}

export interface HistoryBetsInterface {
  empty: {
    icon: string,
    title?: string,
    description?: string
  },
  tabLabel: string,
  settledTab: string,
  unsettledTab: string,
  statuses: BetStatusesInterface,
  betCard: BetCardInterface,
}

interface TransactionTypeFilterOptions extends Record<string, any> {
  deposit: string,
  withdrawal: string
}

interface TransactionStatusFilterOptions extends Record<string, any> {
  review: string,
  pending: string,
  success: string,
  rejected: string
}

export interface HistoryTransactionsInterface extends Record<string, any>{
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
    options: TransactionTypeFilterOptions
  },
  currencyLabel: string,
  statusFilter: {
    label: string,
    options: TransactionStatusFilterOptions
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

export interface HistoryTabInterface extends Record<string, any>{
  bonuses: HistoryBonusesInterface,
  spins: HistorySpinsInterface,
  bets: HistoryBetsInterface,
  transactions: HistoryTransactionsInterface,
  sessions: HistorySessionsInterface,
}

export interface BenefitItemInterface {
  image: string,
  title: string,
  text: string,
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
      backgroundImage: string,
      faceImage: string
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
    betting: CategoryInterface
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
  },
  recentlyPlayed: {
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
  categoryValue: string
}

export interface TurbogamesGroupInterface {
  label: string,
  icon: string,
  buttonLabel: string,
  items: TurboItemInterface[]
}

export interface GameTagInterface {
  identity: string,
  label: string,
  icon: string,
  color: string,
}

export interface LatestWinnersInterface {
  icon: string,
  title: string
}

export interface CurrencyTabsInterface {
  allTab: string,
  cryptoTab: string
}

export interface CurrencyEmptyInterface {
  title: string,
  description: string
}

export interface GlobalComponentsInterface {
  benefits: BenefitsContentInterface,
  promotions: PromotionsContentInterface,
  cardsGroup: CardsGroupInterface,
  categories: GameCategoryInterface[],
  turbogames: TurbogamesGroupInterface,
  gameTags: GameTagInterface[],
  currency: {
    tabs: CurrencyTabsInterface,
    empty: CurrencyEmptyInterface
  }
  globalSeo: SeoContentInterface,
}

export interface DropZoneInterface {
  title: string,
  subTitle: string,
  desc: string,
  hint: string,
}
