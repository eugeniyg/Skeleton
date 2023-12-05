import { defineStore } from "pinia";

interface IFreshchatState {
  newMessages: number;
}

export const useFreshchatStore = defineStore('freshchatStore', {
  state: (): IFreshchatState => ({
    newMessages: 0,
    initialize: true,
  }),

  actions: {
    getWidgetAttributes() {
      const { profile, isLoggedIn } = useProfileStore();

      if(!isLoggedIn) {
        return {};
      }

      const userRestore = localStorage.getItem('__freshchat_restore_id');

      return {
        externalId: profile.id,
        restoreId: userRestore,
      }
    },

    initChat() {
      if(!this.initialize) {
        return;
      }

      this.initialize = false;

      window.fcWidget.init({
        config: {
          headerProperty: {
            hideChatButton: true
          }
        },
        token: "76ea1b8c-4e71-406f-bdb9-5c9d04dd11b6",
        host: "https://turbostars-org-90b688ba9fde9ad17017532.freshchat.com",
        ...this.getWidgetAttributes(),
      });

      window.fcWidget.on('widget:loaded', () => {
        console.log('widget loaded');
        this.setUserChatData();
      })

      window.fcWidget.on('widget:destroyed', () => {
        this.initChat();
      });

      window.fcWidget.on('user:created', function({ status, data }:any) {
        console.log('user created', data);
        const { isLoggedIn } = useProfileStore();

        if(isLoggedIn && data?.restoreId) {
          localStorage.setItem('__freshchat_restore_id', data.restoreId);
        }
      });

      window.fcWidget.on('unreadCount:notify', ({ count }: { count: number }) => {
        this.newMessages = count;
      });
    },

    setUserChatData(): void {
      const { profile, isLoggedIn } = useProfileStore();
      const segmentsArr = profile?.segments.map(segment => segment.name);
      const profileSegments = segmentsArr?.length ? segmentsArr.join(', ') : null;

      const { activePlayerBonuses, activePlayerFreeSpins } = useBonusStore();

      if (isLoggedIn) {
        window.fcWidget.user.setProperties({
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          email: profile?.email,
          meta: {
            cf_segments: profileSegments,
            cf_active_bonuses: `${!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)}`,
          },
        });
      }
    },

    // initChat():void {
    //   this.initializeWidget();
    //   this.setUserChatData();

    //   window.fcWidget.on('user:created', function({ status, data }:any) {
    //     console.log('user created', data);
    //     const { isLoggedIn } = useProfileStore();

    //     if(isLoggedIn && data?.restoreId) {
    //       localStorage.setItem('__freshchat_restore_id', data.restoreId);
    //     }

    //     // console.log('cfg', window.fcWidget.getConfig());
    //     // if (isLoggedIn && status === 200 && data.restoreId) {
    //     //   const stringifyData = JSON.stringify(
    //     //     [...storeRestoreList, { externalId: profile?.id, restoreId: data.restoreId }]
    //     //   )
    //     //   localStorage.setItem('restore', stringifyData);
    //     // }
    //   });

    //   window.fcWidget.on('user:cleared', () => {
    //     console.log('user cleared');
    //     this.setUserChatData();
    //     // window.fcWidget.destroy();
    //   });

    //   window.fcWidget.on('widget:destroyed', () => {
    //     // const store = useFreshchatStore();

    //     // if(state.reinitialize) {
    //     //   this.cr
    //     // }

    //     console.log('widget destroyed');
    //   })

    //   window.fcWidget.on('unreadCount:notify', function({ count }: { count: number }) {
    //     const freshchatStore = useFreshchatStore();
    //     freshchatStore.newMessages = count;
    //   });

    //   // if(window.fcWidget && !window.fcWidget.isInitialized()) {
    //   //   console.log('reinitialize');
    //   //   // window.fcWidget.init();
    //   // }

    //   // window.fcWidget.init({
    //   //   config: {
    //   //     headerProperty: {
    //   //       hideChatButton: true
    //   //     }
    //   //   },
    //   //   token: "76ea1b8c-4e71-406f-bdb9-5c9d04dd11b6",
    //   //   host: "https://turbostars-org-90b688ba9fde9ad17017532.freshchat.com"
    //   // })
    // },

    async updateChat():Promise<void> {
      console.log('update');
      this.initialize = true;

      try {
        await window.fcWidget.user.clear()
      } catch (e) {
        console.log(e);
        // do nothing
      }

      window.fcWidget.destroy();
    },
  }
});
