export interface ValidationMessageInterface {
  [key: string]: string
}

interface FieldInterface {
  label: string,
  placeholder?: string
}

export interface FieldsContentInterface {
  [key: string]: FieldInterface
}

interface LinkInterface {
  label: string,
  url: string,
  gameList?: string[]
}

interface MenuItemInterface {
  label: string,
  url?: string,
  items?: LinkInterface[]
}

export interface SiteSidebarInterface {
  gamesToggler: LinkInterface[],
  topMenu : LinkInterface[],
  profileMenu: {
    levelLabel: string,
    depositButton: string,
    profileButton: LinkInterface
  },
  tokenMenu: LinkInterface[],
  bonusesMenu: MenuItemInterface[],
  userMenu: MenuItemInterface[],
  bottomMenu: MenuItemInterface[],
  sidebarFooterMenu: LinkInterface[]
}

export interface HeaderInterface {
  loginButton: string,
  registrationButton: string,
  search: {
    placeholder: string,
    moreButton: string,
    emptyLabel: string,
    emptyText: string,
    tryLabel: string
  },
  depositButton: string
}

export interface UserNavigationInterface {
  profileLinks: LinkInterface[],
  logoutButton: string
}

interface FooterBlockInterface {
  title: string,
  items: LinkInterface[],
}

export interface FooterInterface {
  promoMenu: FooterBlockInterface,
  infoMenu: FooterBlockInterface,
  helpMenu: FooterBlockInterface,
  responsibilityLabel: string,
  copyright: string
}

export interface CookiePopupInterface {
  text: string,
  acceptButton: string
}

export interface MobileMenuInterface {
  menuLabel: string,
  items: LinkInterface[]
}

export interface MainLayoutInterface {
  siteSidebar: SiteSidebarInterface,
  header: HeaderInterface,
  userNavigation: UserNavigationInterface,
  footer: FooterInterface,
  cookiePopup: CookiePopupInterface,
  mobileMenu: MobileMenuInterface
}

export interface ConfirmInterface {
  title: string,
  button: string
}

export interface SuccessInterface {
  title: string,
  description: string,
  button: string
}

export interface ForgotInterface {
  title: string,
  description?: string,
  forgotButton: string,
  registrationButton: string
}

export interface ErrorInterface {
  title: string,
  description: string,
  button: string
}

export interface LoginInterface {
  title: string,
  loginButton: string,
  forgotButton: string,
  registrationButton: string
}

export interface WithdrawInterface {
  title: string,
  balanceLabel: string,
  withdrawLabel: string,
  sumLabel: string,
  minSum: string,
  withdrawButton: string
}

export interface ResetInterface {
  title: string,
  resetButton: string
}

export interface RegistrationInterface {
  title: string,
  agreeEmailLabel: string,
  agreeSmsLabel: string,
  registrationButton: string,
  loginButton: string,
  promo: {
    title: string,
    secondTitle: string,
    additionalTitle: string,
    advantages?: { icon: string, label: string }[]
  }
}

export interface DepositInterface {
  title: string,
  balanceLabel: string,
  sumLabel: string,
  minSum: string,
  togglerLabel: string,
  bonuses?: { image?: string, title: string, description?: string }[],
  depositButton: string
}

export interface PopupsInterface {
  confirm: ConfirmInterface,
  success: SuccessInterface,
  forgot: ForgotInterface,
  error: ErrorInterface,
  login: LoginInterface,
  withdraw: WithdrawInterface,
  reset: ResetInterface,
  registration: RegistrationInterface,
  deposit: DepositInterface
}

interface SlideImageInterface {
  backgroundImage: string,
  faceImage: string
}

interface SlideImagesInterface {
  mobile: SlideImageInterface,
  desktop: SlideImageInterface
}

export interface SlideInterface {
  slideStatus: string,
  title: string,
  content?: string,
  button?: {
    label: string,
    url?: string,
  }
  images: SlideImagesInterface
}

export interface AlertInterface {
  type: string,
  title: string,
  description?: string
}

export interface AlertsListInterface {
  limitedDeposit: AlertInterface,
  invalidResetCode: AlertInterface,
  limitedRealGame: AlertInterface,
  sentMessage: AlertInterface,
  sentResetLink: AlertInterface,
  somethingWrong: AlertInterface,
  userCanceledWithdrawal: AlertInterface,
  withdrawalProcessed: AlertInterface,
  passwordChanged: AlertInterface,
  successRegistration: AlertInterface,
  accountBlocked: AlertInterface,
}
