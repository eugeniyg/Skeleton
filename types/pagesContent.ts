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
