import { defineStore } from 'pinia';
import type { IPlayerQuest, IPlayerQuestEventTask, IWebSocketResponse } from '@skeleton/core/types';

interface IQuestsStoreState {
  activeQuests: IPlayerQuest[];
  rewardsModalTitle: string;
  rewardsList: { currency: string; amount: number }[];
  questsSubscription: any;
  tasksModalData: IPlayerQuest | undefined;
  tasksModalImage: string;
}

export const useQuestsStore = defineStore('questsStore', {
  state: (): IQuestsStoreState => ({
    activeQuests: [],
    rewardsModalTitle: '',
    rewardsList: [],
    questsSubscription: undefined,
    tasksModalData: undefined,
    tasksModalImage: '',
  }),

  actions: {
    async getActiveQuests(): Promise<void> {
      const { getPlayerQuests } = useCoreQuestApi();
      const { activeAccount } = useWalletStore();
      const { data } = await getPlayerQuests({ state: [2], currency: activeAccount?.currency });
      this.activeQuests = data;
    },

    async openRewardsModal(rewards: { currency: string; amount: number }[], modalTitle: string): Promise<void> {
      this.rewardsModalTitle = modalTitle;
      this.rewardsList = rewards;
      const { openModal } = useModalStore();
      await openModal('quest-rewards');
    },

    async openTasksModal(questData: IPlayerQuest, questImage: string): Promise<void> {
      this.tasksModalData = questData;
      this.tasksModalImage = questImage;
      const { openModal } = useModalStore();
      await openModal('quest-tasks');
    },

    updateQuest(questData: IPlayerQuest | undefined): void {
      if (!questData) return;

      const { getContent } = useProjectMethods();
      const { showAlert } = useLayoutStore();
      const { globalComponentsContent, defaultLocaleGlobalComponentsContent, alertsData, defaultLocaleAlertsData } =
        useGlobalStore();

      if (questData.state !== 3) {
        const newStateName = getContent(
          globalComponentsContent,
          defaultLocaleGlobalComponentsContent,
          `constants.questsStatuses.${questData.state}`
        );
        const alertData = getContent(alertsData, defaultLocaleAlertsData, 'quests.stateChanged');
        if (alertData.title) {
          showAlert({
            ...alertData,
            title: alertData.title.replace('{name}', `"${questData.name}"`).replace('{status}', newStateName),
          });
        }
      }

      const findActiveQuest = this.activeQuests.find(quest => quest.id === questData.id);
      if (findActiveQuest || questData.state === 2) this.getActiveQuests();

      if (questData.state === 3) useEvent('completedQuestsUpdated');
      if ([5, 6].includes(questData.state)) useEvent('expiredQuestsUpdated');
    },

    updateTask(taskData: IPlayerQuestEventTask | undefined): void {
      if (!taskData) return;

      const { getContent } = useProjectMethods();
      const {
        alertsData,
        defaultLocaleAlertsData,
        globalComponentsContent,
        defaultLocaleGlobalComponentsContent
      } = useGlobalStore();
      const { showAlert } = useLayoutStore();
      this.activeQuests = this.activeQuests.map(quest => {
        if (quest.id === taskData.questId) {
          if (taskData.isActive && taskData.progress === taskData.quantity) {
            const alertData = getContent(alertsData, defaultLocaleAlertsData, 'quests.taskCompleted');
            const taskTypeName = getContent(
              globalComponentsContent,
              defaultLocaleGlobalComponentsContent,
              `constants.taskTypes.${taskData.type}.label`
            );
            if (alertData.title)
              showAlert({
                ...alertData,
                title: alertData.title
                  .replace('{taskName}', `"${taskTypeName}"`)
                  .replace('{questName}', `"${quest.name}"`),
              });
          }

          const questTasks = quest.tasks.map(task => {
            if (task.id === taskData.id)
              return {
                ...task,
                isActive: taskData.isActive,
                isCompleted: taskData.isCompleted,
                progress: taskData.progress,
              };
            return task;
          });

          return { ...quest, tasks: questTasks };
        } else return quest;
      });
    },

    questsSocketTrigger(webSocketResponse: IWebSocketResponse): void {
      if (webSocketResponse.data.event === 'quest.updated') this.updateQuest(webSocketResponse.data.quest);
      else if (webSocketResponse.data.event === 'quest.task.updated') this.updateTask(webSocketResponse.data.task);
    },

    subscribeQuestsSocket(): void {
      const profileStore = useProfileStore();
      if (profileStore.profile?.id) {
        const { createSubscription } = useWebSocket();
        this.questsSubscription = createSubscription(
          `retention:quests#${profileStore.profile?.id}`,
          this.questsSocketTrigger
        );
      }
    },

    unsubscribeQuestsSocket(): void {
      if (this.questsSubscription) {
        this.questsSubscription.unsubscribe();
        this.questsSubscription.removeAllListeners();
      }
    },
  },
});
