import { defineStore } from "pinia";

interface IFreshchatState {
  newMessages: number;
  initialize: boolean;
}

export const useFreshchatStore = defineStore('freshchatStore', {
  state: (): IFreshchatState => ({
    newMessages: 0,
    initialize: true,
  }),

  getters: {
    projectHasFreshchat() {
      if (!window) return undefined;
      const { public: { freshchatHost, freshchatToken }} = useRuntimeConfig();
      return !!(freshchatHost && freshchatToken && window.fcWidget);
    }
  },

  actions: {
    getProfileData(isUpdate = false) {
      const { profile } = useProfileStore();
      const segmentsArr = profile?.segments.map(segment => segment.name);
      const profileSegments = segmentsArr?.length ? segmentsArr.join(', ') : '';
      const { activePlayerBonuses, activePlayerFreeSpins } = useBonusStore();

      const { cf_segments, cf_active_bonuses, ...mainParams } = {
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? '',
        email: profile?.email ?? '',
        cf_segments: profileSegments,
        cf_active_bonuses: `${!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)}`,
      }

      return isUpdate
        ? { ...mainParams, meta: { cf_segments, cf_active_bonuses } }
        : { ...mainParams, cf_segments, cf_active_bonuses };
    },

    async updateFreshchatUser(): Promise<void> {
      if (!window.fcWidget) return;
      const { profile } = useProfileStore();

      if (profile?.freshchatRestoreId) {
        try {
          const profileData = this.getProfileData(true);
          await window.fcWidget.user.update(profileData);
        } catch {
          console.error('Freshchat user not updated!');
        }
      } else {
        const profileData = this.getProfileData();
        window.fcWidget.user.setProperties(profileData);
      }
    },

    async setChatRestoreId(restoreId: string): Promise<void> {
      const { profile, setProfileData } = useProfileStore();
      if (profile?.freshchatRestoreId) return;

      const { changeProfileData } = useCoreProfileApi();
      try {
        const submitResult = await changeProfileData({ freshchatRestoreId: restoreId });
        setProfileData(submitResult);
      } catch {
        console.error('Restore ID not updated!');
      }
    },

    getUserIdentity() {
      const { profile, isLoggedIn } = useProfileStore();
      if (!isLoggedIn) return {};

      return {
        externalId: profile?.id,
        restoreId: profile?.freshchatRestoreId || null,
      }
    },

    setUserChatData(): void {
      const { isLoggedIn } = useProfileStore();

      if (isLoggedIn) {
        this.updateFreshchatUser();

        useListen('profileUpdated', this.updateFreshchatUser);
        useListen('freeSpinsUpdated', this.updateFreshchatUser);
        useListen('bonusesUpdated', this.updateFreshchatUser);
        useListen('accountChanged', this.updateFreshchatUser);
      }
    },

    initChat() {
      const { public: { freshchatHost, freshchatToken }} = useRuntimeConfig();

      if (!this.initialize || !freshchatHost) return;
      this.initialize = false;

      window.fcWidget.init({
        config: {
          headerProperty: {
            hideChatButton: true
          }
        },
        token: freshchatToken,
        host: freshchatHost,
        ...this.getUserIdentity(),
      });

      window.fcWidget.on('widget:loaded', this.setUserChatData);
      window.fcWidget.on('widget:destroyed', this.initChat);

      window.fcWidget.on('user:created', ({ data }: any) => {
        const { isLoggedIn } = useProfileStore();

        if(isLoggedIn && data?.restoreId) {
          this.setChatRestoreId(data.restoreId);
        }
      });

      window.fcWidget.on('unreadCount:notify', ({ count }: { count: number }) => {
        this.newMessages = count;
      });
    },

    async updateChat():Promise<void> {
      this.initialize = true;

      try {
        await window.fcWidget.user.clear()
      } catch  {
        console.log('Chat not cleared, chat empty!');
      }

      useUnlisten('profileUpdated');
      useUnlisten('freeSpinsUpdated');
      useUnlisten('bonusesUpdated');
      useUnlisten('accountChanged');
      window.fcWidget.destroy();
    },
  }
});
