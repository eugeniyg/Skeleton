<template>
  <vue-final-modal
    v-model="showTasksModal"
    class="modal-quest-tasks"
    :clickToClose="false"
    @clickOutside="closeTasksModal"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
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

        <div class="quest-tasks" :class="{ 'inactive': ![1,2].includes(tasksModalData?.state || 0) }">
          <div v-if="[1,2].includes(tasksModalData?.state || 0)" class="quest-tasks__count">{{ blockLabel }}</div>

          <div class="quest-tasks__items">
            <div class="quest-tasks__completed" v-if="completedTasks.length">
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
    return tasksModalData.value?.tasks.filter(task => task.progress === task.quantity) || [];
  })

  const activeTasks = computed(() => {
    return tasksModalData.value?.tasks.filter(task => task.progress < task.quantity) || [];
  })

  const blockLabel = computed(() => {
    const contentMessage = getContent(popupsData.value, defaultLocalePopupsData.value, 'questTasks.blockLabel');
    return contentMessage ? contentMessage.replace('{tasksLeft}', activeTasks.value.length) : '';
  })

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