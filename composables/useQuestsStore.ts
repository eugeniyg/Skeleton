import {defineStore} from 'pinia';
import type {
  IPlayerQuest
} from '@skeleton/core/types';

interface IQuestsStoreState {
  playerActiveQuests: IPlayerQuest[];
}

export const useQuestsStore = defineStore('questsStore', {
  state: ():IQuestsStoreState => ({
    playerActiveQuests: []
  }),

  actions: {
    async getPlayerActiveQuests():Promise<void> {
      const { getPlayerQuests } = useCoreQuestApi();
      const { data } = await getPlayerQuests({ state: [1, 2] });
      this.playerActiveQuests = data;
    },
  },
});
