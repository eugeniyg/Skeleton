import debounce from 'lodash/debounce.js';
import { changeProfileData } from '@skeleton/api/profile';

interface IFreshchatState {
  initialize: boolean;
  scriptAdded: boolean;
  freshChatNewMessages: number;
}

export const useFreshchatStore = defineStore('freshchatStore', {
  state: (): IFreshchatState => ({
    initialize: true,
    scriptAdded: false,
    freshChatNewMessages: 0,
  }),

  getters: {
    projectHasFreshchat() {
      const {
        public: { freshchatParams },
      } = useRuntimeConfig();
      return !!(freshchatParams?.host && freshchatParams?.token);
    },
  },

  actions: {
    addFreshChatScript() {
      if (!this.projectHasFreshchat) return;
      if (this.scriptAdded) {
        this.initChat();
        return;
      }

      this.scriptAdded = true;
      const {
        public: { freshchatParams },
      } = useRuntimeConfig();
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('src', `${freshchatParams?.host}/js/widget.js`);
      document.body.appendChild(scriptElement);
      scriptElement.onload = this.initChat;
    },

    getProfileData(isUpdate = false) {
      const { profile } = useProfileStore();
      const { activePlayerBonuses, activePlayerFreeSpins } = useBonusStore();
      const { currentLocale, globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
      let isVip: string | boolean = 'unknown';
      const contentVipSegment = defaultLocaleGlobalComponentsContent
        ? defaultLocaleGlobalComponentsContent.commonContent.vipSegmentId
        : globalComponentsContent?.commonContent.vipSegmentId;
      if (contentVipSegment && profile) {
        isVip = String(profile.segmentIds.some(segmentId => segmentId === contentVipSegment));
      }
      const { loyaltyAccount } = useLoyaltyStore();
      const { totalBaseCurrencyDepositAmount } = useWalletStore();

      const { firstName, lastName, email, ...additionalData } = {
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? '',
        email: profile?.email ?? '',
        cf_site_locale: `${currentLocale?.code} - ${currentLocale?.name}`,
        cf_vip_segment: isVip,
        cf_loyalty_level:
          profile && loyaltyAccount
            ? `Level ${loyaltyAccount.currentLevel.order}, ${loyaltyAccount.currentLevel.name}`
            : 'unknown',
        cf_active_bonuses: `${!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)}`,
        cf_deposit_sum: totalBaseCurrencyDepositAmount ?? 'unknown',
      };

      return isUpdate
        ? { firstName, lastName, email, meta: additionalData }
        : { firstName, lastName, email, ...additionalData };
    },

    updateFreshchatUser: debounce(async function (this: any): Promise<void> {
      if (!window.fcWidget) return;
      const { profile } = useProfileStore();

      if (profile?.freshchatRestoreId) {
        try {
          const profileData = this.getProfileData(true);
          await window.fcWidget.user.update(profileData);
        } catch {
          console.log('Freshchat user not updated!');
        }
      } else {
        const profileData = this.getProfileData();
        window.fcWidget.user.setProperties(profileData);
      }
    }, 2000),

    async setChatRestoreId(restoreId: string): Promise<void> {
      const { profile, setProfileData } = useProfileStore();
      if (profile?.freshchatRestoreId) return;

      try {
        const submitResult = await changeProfileData({ freshchatRestoreId: restoreId });
        setProfileData(submitResult);
      } catch {
        console.log('Restore ID not updated!');
      }
    },

    getUserIdentity() {
      const { profile, isLoggedIn } = useProfileStore();
      if (!isLoggedIn) return {};

      return {
        externalId: profile?.id,
        restoreId: profile?.freshchatRestoreId || null,
      };
    },

    setUserChatData(): void {
      const { isLoggedIn } = useProfileStore();

      if (isLoggedIn) {
        this.updateFreshchatUser();

        useListen('profileUpdated', this.updateFreshchatUser);
        useListen('freeSpinsUpdated', this.updateFreshchatUser);
        useListen('bonusesUpdated', this.updateFreshchatUser);
        useListen('accountChanged', this.updateFreshchatUser);
        useListen('invoicesStatisticsUpdated', this.updateFreshchatUser);
        useListen('loyaltyLevelUpdated', this.updateFreshchatUser);
      }
    },

    initChat() {
      const {
        public: { freshchatParams },
      } = useRuntimeConfig();

      if (!this.initialize || !freshchatParams?.host) return;
      this.initialize = false;

      window.fcWidget.init({
        config: {
          headerProperty: {
            hideChatButton: true,
          },
        },
        token: freshchatParams?.token,
        host: freshchatParams?.host,
        ...this.getUserIdentity(),
      });

      window.fcWidget.on('widget:loaded', this.setUserChatData);

      if (freshchatParams?.guestAvailable) window.fcWidget.on('widget:destroyed', this.initChat);

      window.fcWidget.on('user:created', ({ data }: any) => {
        const { isLoggedIn } = useProfileStore();

        if (isLoggedIn && data?.restoreId) {
          this.setChatRestoreId(data.restoreId);
        }
      });

      window.fcWidget.on('unreadCount:notify', ({ count }: { count: number }) => {
        this.freshChatNewMessages = count;
      });
    },

    async updateFreshChat(): Promise<void> {
      const {
        public: { freshchatParams },
      } = useRuntimeConfig();
      if (!freshchatParams?.host || !window.fcWidget) return;

      this.initialize = true;

      try {
        await window.fcWidget.user.clear();
      } catch {
        console.log('Chat not cleared, chat empty!');
      }

      useUnlisten('profileUpdated', this.updateFreshchatUser);
      useUnlisten('freeSpinsUpdated', this.updateFreshchatUser);
      useUnlisten('bonusesUpdated', this.updateFreshchatUser);
      useUnlisten('accountChanged', this.updateFreshchatUser);
      useUnlisten('invoicesStatisticsUpdated', this.updateFreshchatUser);
      useUnlisten('loyaltyLevelUpdated', this.updateFreshchatUser);
      window.fcWidget.destroy();
    },
  },
});
