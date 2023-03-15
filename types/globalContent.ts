export interface ValidationMessageInterface {
  countryCode: string,
  mac_address: string,
  max: string,
  alpha_num: string,
  languageCode: string,
  digits: string,
  regex: string,
  ip: string,
  accepted: string,
  boolean: string,
  login: string,
  minAge: string,
  numeric: string,
  declined: string,
  phone: string,
  date: string,
  url: string,
  digits_between: string,
  date_equals: string,
  string: string,
  lowercase: string,
  min: string,
  uppercase: string,
  alpha_dash: string,
  before_or_equal: string,
  different: string,
  array: string,
  locale: string,
  after_or_equal: string,
  maxAge: string,
  not_regex: string,
  after: string,
  email: string,
  required_if: string,
  alpha: string,
  confirmed: string,
  before: string,
  required: string
}

interface FieldInterface {
  label: string,
  placeholder?: string
}

export interface FieldsContentInterface extends Record<string, any>{
  repeatNewPassword: FieldInterface,
  placeOfBirth: FieldInterface,
  lastName: FieldInterface,
  gender: {
    label: string,
    maleLabel: string,
    femaleLabel: string
  },
  personalIdNumber: FieldInterface,
  securityQuestion: FieldInterface,
  message: FieldInterface,
  agreements: FieldInterface,
  city: FieldInterface,
  bonusCode: FieldInterface,
  birthdate: {
    label: string,
    placeholderDay?: string,
    placeholderMonth?: string,
    placeholderYear?: string
  },
  additionalAddress: FieldInterface,
  nickname: FieldInterface,
  phone: FieldInterface,
  currency: FieldInterface,
  currentPassword: FieldInterface,
  address: FieldInterface,
  receiveEmailPromo: FieldInterface,
  country: FieldInterface,
  postalCode: FieldInterface,
  language: FieldInterface,
  timeZone: FieldInterface,
  receiveSmsPromo: FieldInterface,
  newPassword: FieldInterface,
  firstName: FieldInterface,
  password: FieldInterface,
  profession: FieldInterface,
  nationality: FieldInterface,
  email: FieldInterface,
  securityAnswer: FieldInterface
}

interface LinkInterface {
  label: string,
  url: string,
  gameList?: string[]
}

export interface MenuItemInterface {
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
  curacao: {
    image: string,
    url: string,
    text: string
  }
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

export interface RegistrationCancelInterface {
  title: string,
  bonusImage: string,
  bonusText: string,
  backButton: string,
  closeButton: string
}

export interface DepositInterface {
  title: string,
  balanceLabel: string,
  sumLabel: string,
  addressTitle: string,
  addressDescription: string,
  addressInputLabel: string,
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
  registrationCancel: RegistrationCancelInterface,
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
  resentVerification: AlertInterface,
  depositSuccess: AlertInterface,
  depositError: AlertInterface,
  withdrawSuccess: AlertInterface,
  withdrawError: AlertInterface,
}
