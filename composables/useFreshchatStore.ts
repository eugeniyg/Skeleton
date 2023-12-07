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

    getChatRestoreId(): Maybe<string> {
      const { profile } = useProfileStore();
      const storeData = localStorage.getItem('fc_restore');
      const storeRestoreList: { externalId: string, restoreId: string }[] = storeData ? JSON.parse(storeData) : [];
      return storeRestoreList.find(storageData => storageData.externalId === profile?.id)?.restoreId || null;
    },

    async updateFreshchatUser(): Promise<void> {
      if (!window.fcWidget) return;
      const restoreId = this.getChatRestoreId();

      if (restoreId) {
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

    setChatRestoreId(restoreId: string) {
      if (this.getChatRestoreId()) return;

      const { profile } = useProfileStore();
      const storeData = localStorage.getItem('fc_restore');
      const storeRestoreList: { externalId: string, restoreId: string }[] = storeData ? JSON.parse(storeData) : [];
      const stringifyData = JSON.stringify([...storeRestoreList, { externalId: profile?.id, restoreId }]);
      localStorage.setItem('fc_restore', stringifyData);
    },

    getUserIdentity() {
      const { profile, isLoggedIn } = useProfileStore();
      if (!isLoggedIn) return {};

      return {
        externalId: profile?.id,
        restoreId: this.getChatRestoreId(),
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
