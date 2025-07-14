import type { ILoyaltyUpdatedEvent, IPlayerLoyaltyAccount } from '@skeleton/core/types';

interface ILoyaltyStoreState {
  loyaltyAccount: Maybe<IPlayerLoyaltyAccount>;
  loyaltySubscription: any;
  levelNotificationEnabled: boolean;
  levelNotificationTimer: any;
}

export const useLoyaltyStore = defineStore('loyaltyStore', {
  state: (): ILoyaltyStoreState => ({
    loyaltyAccount: null,
    loyaltySubscription: null,
    levelNotificationEnabled: false,
    levelNotificationTimer: undefined,
  }),

  getters: {
    currentLevelName(state): string {
      if (!state.loyaltyAccount) return '';
      return state.loyaltyAccount.currentLevel.name || '';
    },

    nextLevelName(state): string {
      if (!state.loyaltyAccount) return '';
      return state.loyaltyAccount.nextLevel?.name || '';
    },

    currentPoints(state): number {
      if (!state.loyaltyAccount) return 0;
      return state.loyaltyAccount.points;
    },

    nextLevelPoints(state): number {
      if (!state.loyaltyAccount) return 0;
      return state.loyaltyAccount.nextLevel?.points || this.currentPoints;
    },

    currentLevelProgress(state): number {
      if (!state.loyaltyAccount) return 0;

      const prevLevelPoints = state.loyaltyAccount.currentLevel.points;
      const currentLevelPoints = Math.round(this.currentPoints - prevLevelPoints);
      const pointsToNextLevel = Math.round(this.nextLevelPoints - prevLevelPoints);

      const progressFloat = (currentLevelPoints / pointsToNextLevel) * 100;
      return Math.round(progressFloat * 100) / 100;
    },
  },

  actions: {
    async getPlayerLoyalty(): Promise<void> {
      const { getPlayerLoyaltyAccount } = useCoreProfileApi();
      this.loyaltyAccount = await getPlayerLoyaltyAccount();
    },

    loyaltySocketTrigger({ data }: ILoyaltyUpdatedEvent): void {
      const oldLevelValue = this.loyaltyAccount?.currentLevel?.order;
      const newLevelValue = data.playerAccount?.currentLevel?.order;
      const showNewLevelModal = oldLevelValue && newLevelValue && oldLevelValue < newLevelValue;
      if (data?.playerAccount) this.loyaltyAccount = data.playerAccount;
      if (showNewLevelModal) {
        const route = useRoute();
        if (route.name === 'games-id' || route.name === 'locale-games-id') {
          this.showLevelNotification();
          return;
        }

        const { openModal } = useModalStore();
        openModal('loyalty-level');
      }
      useEvent('loyaltyLevelUpdated');
    },

    subscribeLoyaltySocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.loyaltySubscription = createSubscription(
          `retention:accounts#${profileStore.profile?.id}`,
          this.loyaltySocketTrigger
        );
      }
    },

    unsubscribeLoyaltySocket(): void {
      if (this.loyaltySubscription) {
        this.loyaltySubscription.unsubscribe();
        this.loyaltySubscription.removeAllListeners();
      }
    },

    showLevelNotification(): void {
      this.levelNotificationEnabled = true;
      if (this.levelNotificationTimer) clearTimeout(this.levelNotificationTimer);
      this.levelNotificationTimer = setTimeout(() => {
        this.levelNotificationEnabled = false;
      }, 3000);
    },

    closeLevelNotification(): void {
      if (this.levelNotificationTimer) {
        clearTimeout(this.levelNotificationTimer);
      }
      this.levelNotificationEnabled = false;
    },
  },
});
