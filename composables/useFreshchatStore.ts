import { defineStore } from "pinia";

interface IFreshchatState {
  newMessages: number;
}

export const useFreshchatStore = defineStore('freshchatStore', {
  state: (): IFreshchatState => ({
    newMessages: 0
  }),

  actions: {
    setUserChatData(): void {
      const { profile, isLoggedIn } = useProfileStore();
      const segmentsArr = profile?.segments.map(segment => segment.name);
      const profileSegments = segmentsArr?.length ? segmentsArr.join(', ') : null;

      const storeData = localStorage.getItem('restore');
      const storeRestoreList: { externalId: string, restoreId: string }[] = storeData ? JSON.parse(storeData) : [];
      const userRestore = storeRestoreList.find(restoreData => restoreData.externalId === profile?.id)?.restoreId;

      const { activePlayerBonuses, activePlayerFreeSpins } = useBonusStore();

      console.log('isLoggedIn: ', isLoggedIn);
      if (isLoggedIn) {
        window.fcWidgetMessengerConfig = {
          externalId: profile?.id,
          restoreId: userRestore || null
        };

        window.fcWidget.user.setProperties({
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          email: profile?.email,
          cf_segments: profileSegments,
          cf_active_bonuses: `${!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)}`,
        });
      }

      window.fcWidget.on('user:created', function({ status, data }:any) {
        const { isLoggedIn } = useProfileStore();
        if (isLoggedIn && status === 200 && data.restoreId) {
          const stringifyData = JSON.stringify(
            [...storeRestoreList, { externalId: profile?.id, restoreId: data.restoreId }]
          )
          localStorage.setItem('restore', stringifyData);
        }
      });

      window.fcWidget.on('user:cleared', function() {
        console.log('user cleared');
        window.fcWidget.destroy();
      });

      window.fcWidget.on('unreadCount:notify', function({ count }: { count: number }) {
        const freshchatStore = useFreshchatStore();
        freshchatStore.newMessages = count;
      });

      window.fcWidget.on('widget:destroyed', async function() {
        console.log('destroyed');
        const freshchatStore = useFreshchatStore();
        freshchatStore.initChat();
      });
    },

    initChat():void {
      this.setUserChatData();
      window.fcWidget.init({
        config: {
          headerProperty: {
            hideChatButton: true
          }
        },
        token: "76ea1b8c-4e71-406f-bdb9-5c9d04dd11b6",
        host: "https://turbostars-org-90b688ba9fde9ad17017532.freshchat.com"
      })
    },

    async clearChat(): Promise<void> {
      try {
        await window.fcWidget.user.clear()
      } catch {
        console.log('Chat not cleared, chat empty!');
      }
    },

    async updateChat():Promise<void> {
      try {
        await window.fcWidget.user.clear()
      } catch {
        window.fcWidget.destroy();
      }
    },
  }
});