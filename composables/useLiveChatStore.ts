import { defineStore } from 'pinia';
import debounce from 'lodash/debounce';

interface ILiveChatState {
  liveChatNewMessages: number;
}

interface ITokenResponse {
  expiresIn: number;
  entityId: string;
  accessToken: string;
  tokenType: string;
  creationDate: number;
  licenseId: string;
  organizationId: string;
}

interface IChatProfileData {
  userId: string;
  phone: string;
  fingerprint: string;
  locale: string;
  activeBonus: string;
  vipSegment: string;
  loyaltyLevel: string;
  depositSum: string;
}

export const useLiveChatStore = defineStore('liveChatStore', {
  state: (): ILiveChatState => ({
    liveChatNewMessages: 0,
  }),

  getters: {
    projectHasLiveChat() {
      const {
        public: { liveChat },
      } = useRuntimeConfig();
      return !!(liveChat?.enabled && liveChat?.license);
    },
  },

  actions: {
    hideChatAfterClose(): void {
      window.LiveChatWidget.on('visibility_changed', ({ visibility }: { visibility: string }) => {
        if (visibility === 'minimized') window.LiveChatWidget.call('hide');
      });
    },

    setChatReadyState(): void {
      window.LiveChatWidget.on('ready', () => {
        const { isLoggedIn } = useProfileStore();
        if (isLoggedIn) {
          console.log('setChatReadyState');
          useListen('profileUpdated', this.setProfileData);
          useListen('freeSpinsUpdated', this.setProfileData);
          useListen('bonusesUpdated', this.setProfileData);
          useListen('accountChanged', this.setProfileData);
          useListen('invoicesStatisticsUpdated', this.setProfileData);
          useListen('loyaltyLevelUpdated', this.setProfileData);
          this.setProfileData();
        }
        this.hideChatAfterClose();
      });
    },

    async getProfileData(): Promise<IChatProfileData | undefined> {
      const { profile, fingerprintVisitor } = useProfileStore();
      if (!profile) return undefined;

      const { activePlayerBonuses, activePlayerFreeSpins } = useBonusStore();
      const { currentLocale, globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
      let isVip: string | boolean = 'unknown';
      const contentVipSegment = defaultLocaleGlobalComponentsContent
        ? defaultLocaleGlobalComponentsContent.commonContent.vipSegmentId
        : globalComponentsContent?.commonContent.vipSegmentId;
      if (contentVipSegment) {
        isVip = String(profile.segmentIds.some(segmentId => segmentId === contentVipSegment));
      }
      const { loyaltyAccount } = useLoyaltyStore();
      const { totalBaseCurrencyDepositAmount } = useWalletStore();
      const fingerprint = await fingerprintVisitor;

      return {
        userId: profile.id,
        phone: profile.phone ? `+${profile.phone}` : 'unknown',
        fingerprint: fingerprint ?? 'unknown',
        locale: `${currentLocale?.code} - ${currentLocale?.name}`,
        activeBonus: `${!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)}`,
        vipSegment: isVip,
        loyaltyLevel: loyaltyAccount
          ? `Level ${loyaltyAccount.currentLevel.order}, ${loyaltyAccount.currentLevel.name}`
          : 'unknown',
        depositSum: totalBaseCurrencyDepositAmount ?? 'unknown',
      };
    },

    setProfileData: debounce(async function (this: any): Promise<void> {
      console.log('setProfileData');
      const { profile } = useProfileStore();

      if (profile) {
        let name = 'unknown';
        if (profile.firstName) name = profile.firstName;
        if (profile.lastName) name += ` ${profile.lastName}`;
        window.LiveChatWidget.call('set_customer_name', name);
        window.LiveChatWidget.call('set_customer_email', profile.email ?? 'unknown');
        const profileData = await this.getProfileData();
        window.LiveChatWidget.call('set_session_variables', profileData);
      }
    }, 2000),

    getCustomIdentityProvider() {
      let tokenPromise: Promise<ITokenResponse> | null = null;
      const { isLoggedIn, profile } = useProfileStore();
      const cacheKey = isLoggedIn ? `livechat_cache_${profile?.id as string}` : 'livechat_cache_default';
      let cachedToken: ITokenResponse | null = null;

      const {
        public: { liveChat },
      } = useRuntimeConfig();

      const fetchLiveChatToken = async (): Promise<ITokenResponse> => {
        const licenseId = liveChat.license;
        const clientId = liveChat.clientId;
        const organizationId = liveChat.organizationId;

        const response: any = await $fetch.raw('https://accounts.livechat.com/customer/token', {
          method: 'POST',
          body: {
            grant_type: 'cookie',
            response_type: 'token',
            client_id: clientId,
            redirect_uri: 'http://localhost',
            organization_id: organizationId,
            license_id: Number(licenseId),
          },
        });

        console.log('getToken');

        const responseData: {
          access_token: string;
          expires_in: number; // in seconds
          entity_id: string;
          token_type: string;
        } = response._data;

        const tokenResponse: ITokenResponse = {
          expiresIn: responseData.expires_in * 1000,
          entityId: responseData.entity_id,
          accessToken: responseData.access_token,
          tokenType: responseData.token_type,
          creationDate: Date.now(),
          licenseId: licenseId,
          organizationId: organizationId,
        };

        tokenPromise = null;
        window.localStorage.setItem(cacheKey, JSON.stringify(tokenResponse));
        cachedToken = tokenResponse;
        return tokenResponse;
      };

      const isTokenExpired = ({ creationDate, expiresIn }: ITokenResponse): boolean => {
        return Date.now() >= creationDate + expiresIn;
      };

      const storageToken = window.localStorage.getItem(cacheKey);
      if (storageToken) cachedToken = JSON.parse(storageToken);

      const getFreshToken = () => {
        tokenPromise = fetchLiveChatToken();
        return tokenPromise;
      };

      const getToken = () => {
        if (tokenPromise) return tokenPromise;
        if (cachedToken && !isTokenExpired(cachedToken)) return Promise.resolve(cachedToken);
        return getFreshToken();
      };

      const hasToken = () => Promise.resolve(!!cachedToken);
      const invalidate = () => {
        cachedToken = null;
        window.localStorage.removeItem(cacheKey);
      };

      return {
        getToken,
        getFreshToken,
        hasToken,
        invalidate,
      };
    },

    initializeLiveChat(): void {
      const {
        public: { liveChat },
      } = useRuntimeConfig();

      if (!liveChat.enabled || !liveChat.license) return;

      const functionAddChatScript = (n: any, t: any, c: any) => {
        // @ts-expect-error - External LiveChat function
        function i(n) {
          // @ts-expect-error - External LiveChat function
          return e._h ? e._h.apply(null, n) : e._q.push(n);
        }

        const e = {
          _q: [],
          _h: null,
          _v: '2.0',
          on: function (...args: any) {
            i(['on', c.call(args)]);
          },
          once: function (...args: any) {
            i(['once', c.call(args)]);
          },
          off: function (...args: any) {
            i(['off', c.call(args)]);
          },
          get: function (...args: any) {
            if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
            return i(['get', c.call(args)]);
          },
          call: function (...args: any) {
            i(['call', c.call(args)]);
          },
          init: function () {
            const n = t.createElement('script');
            n.async = !0;
            n.type = 'text/javascript';
            n.src = 'https://cdn.livechatinc.com/tracking.js';
            t.head.appendChild(n);
          },
        };

        if (!n.__lc.asyncInit) e.init();
        n.LiveChatWidget = n.LiveChatWidget || e;
      };

      window.__lc = window.__lc || {};
      window.__lc.license = `${liveChat.license}`;
      window.__lc.integration_name = 'manual_channels';
      window.__lc.product_name = 'livechat';
      window.__lc.custom_identity_provider = this.getCustomIdentityProvider;
      functionAddChatScript(window, document, [].slice);

      this.setChatReadyState();
    },

    updateLiveChat(): void {
      useUnlisten('profileUpdated', this.setProfileData);
      useUnlisten('freeSpinsUpdated', this.setProfileData);
      useUnlisten('bonusesUpdated', this.setProfileData);
      useUnlisten('accountChanged', this.setProfileData);
      useUnlisten('invoicesStatisticsUpdated', this.setProfileData);
      useUnlisten('loyaltyLevelUpdated', this.setProfileData);
      window.LiveChatWidget.call('destroy');
      const liveChatScript = document.querySelector('script[href="https://cdn.livechatinc.com/tracking.js"]');
      if (liveChatScript) liveChatScript.remove();

      const {
        public: { liveChat },
      } = useRuntimeConfig();
      const { isLoggedIn } = useProfileStore();

      if (liveChat.guestAvailable || isLoggedIn) this.initializeLiveChat();
    },
  },
});
