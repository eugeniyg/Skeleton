<template>
  <vue-final-modal
    class="modal-quest-tasks"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('quest-tasks')"
  >
    <div class="container">
      <div class="scroll">
        <div class="modal-quest-tasks__card">
          <div class="header">
            <span class="header__back-btn" @click="closeModal('quest-tasks')">
              <span class="header__back-btn-icon">
                <atomic-icon id="arrow-previous" />
              </span>
            </span>

            <span class="title">{{ tasksModalData?.name }}</span>
          </div>

          <div class="modal-quest-tasks__img">
            <atomic-image :src="tasksModalImage" />
          </div>

          <div class="modal-quest-tasks__body">
            <quest-currency
              v-if="tasksModalData?.rewards?.length"
              :currentLocaleContent="questsHubContent?.currentLocaleData"
              :defaultLocaleContent="questsHubContent?.defaultLocaleData"
              :rewards="tasksModalData?.rewards"
            />

            <quest-tasks-card-timer
              v-if="tasksModalData?.state === 2 && tasksModalData?.endAt"
              :expired-at="tasksModalData.endAt"
            />
          </div>
        </div>

        <div class="quest-tasks" :class="{ inactive: inactiveState }">
          <div v-if="inactiveState" class="quest-tasks__count" :class="{ 'is-inactive': inactiveState }">
            {{ blockLabel }}
          </div>

          <div class="quest-tasks__items">
            <div v-if="completedTasks.length" class="quest-tasks__completed">
              <template v-for="(task, index) in completedTasks" :key="task.id">
                <quest-task-card :task-info="task" :task-index="index" :quest-state="tasksModalData?.state" />

                <div
                  v-if="tasksModalData?.state === 2 && index === completedTasks.length - 1"
                  class="quest-tasks-header"
                >
                  {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'inProgressLabel') }}
                </div>
              </template>
            </div>

            <div v-if="activeTasks.length" class="quest-tasks__next">
              <div v-if="tasksModalData?.state === 2 && !completedTasks.length" class="quest-tasks-header">
                {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'inProgressLabel') }}
              </div>

              <template v-for="(task, index) in activeTasks" :key="task.id">
                <div
                  v-if="tasksModalData?.state === 2 && tasksModalData?.taskExecutionOrder === 2 && index === 1"
                  class="quest-tasks-header"
                >
                  {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'nextLabel') }}
                </div>

                <quest-task-card :task-info="task" :task-index="index" :quest-state="tasksModalData?.state" />
              </template>
            </div>
          </div>

          <button-base
            v-if="tasksModalData?.state === 1"
            class="modal-quest-tasks__activate-button"
            size="sm"
            type="primary"
            @click="activateQuest"
          >
            {{ activateQuestButton }}
          </button-base>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent, IQuestsHubModal } from '~/types';
  import { activatePlayerQuest } from '@skeleton/api/retention';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['questTasks']>;
    defaultLocaleData: Maybe<IModalsContent['questTasks']>;
  }>();

  provide('questTasksContent', props.currentLocaleData);
  provide('defaultLocaleQuestTasksContent', props.defaultLocaleData);

  const { modalsList, closeModal } = useModalStore();
  const questsHubContentParams = {
    contentKey: 'modal-quests-hub',
    contentRoute: ['modals', modalsList['quests-hub'].content as string],
  };
  const { getContentData: getQuestsHubContentData } = useContentLogic<IQuestsHubModal>(questsHubContentParams);
  const { data: questsHubContent } = await useLazyAsyncData(getQuestsHubContentData);

  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const questsStore = useQuestsStore();
  const { openTasksModal } = questsStore;
  const { tasksModalData, tasksModalImage } = storeToRefs(questsStore);

  const completedTasks = computed(() => {
    const filteredTasks = tasksModalData.value?.tasks.filter(task => task.progress === task.quantity) || [];
    if (tasksModalData.value?.taskExecutionOrder === 1) return filteredTasks;
    return filteredTasks.sort((prevTask, nextTask) => prevTask.executionOrder - nextTask.executionOrder);
  });

  const activeTasks = computed(() => {
    const filteredTasks = tasksModalData.value?.tasks.filter(task => task.progress < task.quantity) || [];
    if (tasksModalData.value?.taskExecutionOrder === 1) return filteredTasks;
    return filteredTasks.sort((prevTask, nextTask) => prevTask.executionOrder - nextTask.executionOrder);
  });

  const blockLabel = computed(() => {
    const contentMessage = getContent(props.currentLocaleData, props.defaultLocaleData, 'blockLabel');
    return contentMessage ? contentMessage.replace('{tasksLeft}', activeTasks.value.length) : '';
  });

  const activateQuestButton = computed(() => {
    const isQuestCompleted = tasksModalData.value?.tasks.every(task => task.isCompleted);
    return isQuestCompleted
      ? getContent(questsHubContent.value?.currentLocaleData, questsHubContent.value?.defaultLocaleData, 'claimReward')
      : getContent(
          questsHubContent.value?.currentLocaleData,
          questsHubContent.value?.defaultLocaleData,
          'startQuestButton'
        );
  });

  const inactiveState = computed(() => ![1, 2].includes(tasksModalData.value?.state || 0));

  const { showAlert } = useLayoutStore();
  const activation = ref(false);
  const activateQuest = async (): Promise<void> => {
    if (activation.value) return;
    activation.value = true;

    try {
      const questData = await activatePlayerQuest(tasksModalData.value?.id as string);
      useEvent('questActivated');
      await openTasksModal(questData, tasksModalImage.value);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    activation.value = false;
  };
</script>

<style src="~/assets/styles/components/modal/quest-tasks.scss" lang="scss" />
