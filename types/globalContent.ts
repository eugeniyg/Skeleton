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
