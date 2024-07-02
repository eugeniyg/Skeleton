import {defineStore} from 'pinia';
import type {
  IPlayerQuest
} from '@skeleton/core/types';

interface IQuestsStoreState {
  playerActiveQuests: IPlayerQuest[];
  showRewardsModal: boolean;
  rewardsModalTitle: string;
  rewardsList: { currency: string, amount: number }[];
}

export const useQuestsStore = defineStore('questsStore', {
  state: ():IQuestsStoreState => ({
    playerActiveQuests: [],
    showRewardsModal: false,
    rewardsModalTitle: '',
    rewardsList: []
  }),

  actions: {
    async getPlayerActiveQuests():Promise<void> {
      const { getPlayerQuests } = useCoreQuestApi();
      const { data } = await getPlayerQuests({ state: [1, 2] });
      this.playerActiveQuests = data;
    },

    openRewardsModal (rewards: { currency: string, amount: number }[], modalTitle: string):void {
      this.rewardsModalTitle = modalTitle;
      this.rewardsList = rewards;
      this.showRewardsModal = true;
    },

    closeRewardsModal ():void {
      this.showRewardsModal = false;
    },
  },
});
