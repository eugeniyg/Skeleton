import {defineStore} from 'pinia';
import type {
  IPlayerQuest, IPlayerQuestEventTask, IWebSocketResponse
} from '@skeleton/core/types';

interface IQuestsStoreState {
  playerActiveQuests: IPlayerQuest[];
  showRewardsModal: boolean;
  rewardsModalTitle: string;
  rewardsList: { currency: string, amount: number }[];
  questsSubscription: any;
}

export const useQuestsStore = defineStore('questsStore', {
  state: ():IQuestsStoreState => ({
    playerActiveQuests: [],
    showRewardsModal: false,
    rewardsModalTitle: '',
    rewardsList: [],
    questsSubscription: undefined
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

    updateQuest (questData: IPlayerQuest|undefined):void {
      if (!questData) return;

      const { getContent } = useProjectMethods();
      const { showAlert } = useLayoutStore();
      const {
        globalComponentsContent,
        defaultLocaleGlobalComponentsContent,
        alertsData,
        defaultLocaleAlertsData
      } = useGlobalStore();
      const findActiveQuest = this.playerActiveQuests.find((quest) => quest.id === questData.id);

      if ([1,2].includes(questData.state) && !findActiveQuest) {
        const alertData = getContent(alertsData, defaultLocaleAlertsData, 'quests.questIssued');
        if (alertData.title) showAlert({
          ...alertData,
          title: alertData.title.replace('{name}', questData.name)
        })
      } else {
        if (questData.state !== 3) {
          const newStateName = getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, `constants.questsStatuses.${questData.state}`);
          const alertData = getContent(alertsData, defaultLocaleAlertsData, 'quests.stateChanged');
          if (alertData.title) showAlert({
            ...alertData,
            title: alertData.title.replace('{name}', questData.name).replace('{status}', newStateName)
          })
        }

        if (questData.state !== 2) useEvent('questUpdated');
      }

      this.getPlayerActiveQuests();
    },

    updateTask (taskData: IPlayerQuestEventTask|undefined):void {
      if (!taskData) return;

      const { getContent } = useProjectMethods();
      const { alertsData, defaultLocaleAlertsData } = useGlobalStore();
      const { showAlert } = useLayoutStore();
      this.playerActiveQuests = this.playerActiveQuests.map(quest => {
        if (quest.id === taskData.questId) {
          if (taskData.progress === taskData.quantity) {
            const alertData = getContent(alertsData, defaultLocaleAlertsData, 'quests.taskCompleted');
            if (alertData.title) showAlert({
              ...alertData,
              title: alertData.title.replace('{taskName}', taskData.name).replace('{questName}', quest.name)
            })
          }

          const questTasks = quest.tasks.map(task => {
            if (task.id === taskData.id) return {
              ...task,
              isCompleted: taskData.isCompleted,
              progress: taskData.progress
            };
            return task;
          });

          return { ...quest, tasks: questTasks };
        } else return quest;
      })
    },

    questsSocketTrigger (webSocketResponse:IWebSocketResponse): void {
      if (webSocketResponse.data.event === 'quest.updated') this.updateQuest(webSocketResponse.data.quest);
      else if (webSocketResponse.data.event === 'quest.task.updated') this.updateTask(webSocketResponse.data.task);
    },

    subscribeQuestsSocket():void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.questsSubscription = createSubscription(`retention:quests#${profileStore.profile?.id}`, this.questsSocketTrigger);
        console.log(this.questsSubscription);
      }
    },

    unsubscribeQuestsSocket():void {
      if (this.questsSubscription) {
        this.questsSubscription.unsubscribe();
        this.questsSubscription.removeAllListeners();
      }
    },
  },
});
