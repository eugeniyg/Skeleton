export {};

declare global {
  type Maybe<T> = T | null | undefined;
  interface Window {
    BetSdk?: any;
    fcWidgetMessengerConfig?: any;
    fcWidget?: any;
    fcSettings?: any;
    LiveChatWidget?: any;
    __lc?: any;
    pwa?: {
      allowInstall: boolean;
      originalEvent: any;
      install: () => Promise<any>;
      onInit: (cb: () => void) => void;
    };
  }
}
