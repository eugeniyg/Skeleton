<template>
  <div
    class="quest-card"
    :class="taskStatusClasses"
  >
    <div class="quest-card__img">
      <atomic-image
        :src="questImages[questImages.length - (props.questIndex % questImages.length)] || '/img/quests/default-quest-img.png'"
      />
    </div>

    <div class="quest-card__header">
      <div class="quest-currencies">
        <quest-currency :rewards="props.questInfo.rewards" type="real" />

        <quest-currency
          :rewards="props.questInfo.rewards"
          type="virtual"
        />
      </div>

      <quest-timer
        v-if="[1,2].includes(props.questInfo.state) && props.questInfo.endAt"
        :expiredAt="props.questInfo.endAt"
      />
    </div>

    <div class="quest-card__body">
      <div class="quest-card__title">
        {{ props.questInfo.name }}
      </div>

      <quest-progress :taskList="props.questInfo.tasks" />
    </div>

    <div v-if="[1,2].includes(props.questInfo.state)" class="quest-card__actions">
      <button-base
        v-if="props.questInfo.state === 1"
        size="sm"
        type="primary"
        @click="activateQuest"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.startQuestButton') }}
      </button-base>

      <button-base
        v-else
        size="xs"
        type="ghost"
        @click="cancelQuest"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.cancelQuestButton') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuest } from "@skeleton/core/types";

  const props = defineProps<{
    questIndex: number;
    questInfo: IPlayerQuest;
  }>()

  const emit = defineEmits(['openRewardsModal']);

  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const questImages = computed(() => {
    const imgObjArr: { src: string }[] = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.questsImages') || [];
    return imgObjArr.map(imgObj => imgObj.src);
  })

  const taskStatusClasses = computed(() => ({
    'is-active': [1,2].includes(props.questInfo?.state),
    'is-bw-enabled': ![1,2].includes(props.questInfo?.state),
    'is-completed': [3,4].includes(props.questInfo?.state),
    'is-expired': [5,6].includes(props.questInfo?.state)
  }));

  const { showAlert } = useLayoutStore();
  const actionInProcess = ref(false);
  const { activatePlayerQuest, cancelPlayerQuest } = useCoreQuestApi();
  const activateQuest = async (): Promise<void> => {
    if (actionInProcess.value) return;
    actionInProcess.value = true;

    try {
      await activatePlayerQuest(props.questInfo.id);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      actionInProcess.value = false;
    }
  }

  const cancelQuest = async (): Promise<void> => {
    if (actionInProcess.value) return;
    actionInProcess.value = true;

    try {
      await cancelPlayerQuest(props.questInfo.id);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      actionInProcess.value = false;
    }
  }
</script>

<style src="~/assets/styles/components/quest/card.scss" lang="scss"/>