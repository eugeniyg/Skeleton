<template>
  <vue-final-modal
    v-model="showTasksModal"
    class="modal-quest-tasks"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
    @clickOutside="closeTasksModal"
  >
    <div class="container">
      <div class="scroll">
        <div class="modal-quest-tasks__card">
          <div class="header">
            <span class="header__back-btn" @click="closeTasksModal">
              <span class="header__back-btn-icon">
                <atomic-icon id="arrow_previous"/>
              </span>
            </span>

            <span class="title">{{ tasksModalData?.name }}</span>
          </div>

          <div class="modal-quest-tasks__img">
            <atomic-image :src="tasksModalImage" />
          </div>

          <div class="modal-quest-tasks__body">
            <quest-currency :rewards="tasksModalData?.rewards" />

            <quest-tasks-card-timer
              v-if="tasksModalData?.state === 2 && tasksModalData?.endAt"
              :expiredAt="tasksModalData.endAt"
            />
          </div>
        </div>

        <div class="quest-tasks" :class="{ 'inactive': inactiveState }">
          <div
            v-if="inactiveState"
            class="quest-tasks__count"
            :class="{ 'is-inactive': inactiveState }"
          >
            {{ blockLabel }}
          </div>

          <div class="quest-tasks__items">
            <div v-if="completedTasks.length" class="quest-tasks__completed">
              <template v-for="(task, index) in completedTasks" :key="task.id">
                <quest-task-card
                  :taskInfo="task"
                  :taskIndex="index"
                  :questState="tasksModalData?.state"
                />

                <div
                  v-if="(tasksModalData?.state === 2) && (index === completedTasks.length - 1)"
                  class="quest-tasks-header"
                >
                  {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.inProgressLabel') }}
                </div>
              </template>
            </div>

            <div v-if="activeTasks.length" class="quest-tasks__next">
              <div v-if="(tasksModalData?.state === 2) && !completedTasks.length" class="quest-tasks-header">
                {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.inProgressLabel') }}
              </div>

              <template v-for="(task, index) in activeTasks" :key="task.id">
                <div v-if="(tasksModalData?.state === 2) && tasksModalData?.taskExecutionOrder === 2 && index === 1" class="quest-tasks-header">
                  {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.nextLabel') }}
                </div>

                <quest-task-card
                  :taskInfo="task"
                  :taskIndex="index"
                  :questState="tasksModalData?.state"
                />
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
            {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.startQuestButton') }}
          </button-base>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const questsStore = useQuestsStore();
  const { closeTasksModal, openTasksModal } = questsStore;
  const { showTasksModal, tasksModalData, tasksModalImage } = storeToRefs(questsStore);

  const completedTasks = computed(() => {
    const filteredTasks = tasksModalData.value?.tasks.filter(task => task.progress === task.quantity) || [];
    if (tasksModalData.value?.taskExecutionOrder === 1) return filteredTasks;
    return filteredTasks.sort((prevTask, nextTask) => prevTask.executionOrder - nextTask.executionOrder);
  })

  const activeTasks = computed(() => {
    const filteredTasks = tasksModalData.value?.tasks.filter(task => task.progress < task.quantity) || [];
    if (tasksModalData.value?.taskExecutionOrder === 1) return filteredTasks;
    return filteredTasks.sort((prevTask, nextTask) => prevTask.executionOrder - nextTask.executionOrder);
  })

  const blockLabel = computed(() => {
    const contentMessage = getContent(popupsData.value, defaultLocalePopupsData.value, 'questTasks.blockLabel');
    return contentMessage ? contentMessage.replace('{tasksLeft}', activeTasks.value.length) : '';
  })

  const inactiveState = computed(() => ![1,2].includes(tasksModalData.value?.state || 0));

  const { showAlert } = useLayoutStore();
  const activation = ref(false);
  const { activatePlayerQuest } = useCoreQuestApi();
  const activateQuest = async (): Promise<void> => {
    if (activation.value) return;
    activation.value = true;

    try {
      const questData = await activatePlayerQuest(tasksModalData.value?.id as string);
      openTasksModal(questData, tasksModalImage.value);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    activation.value = false;
  }
</script>

<style src="~/assets/styles/components/modal/quest-tasks.scss" lang="scss"/>
