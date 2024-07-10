<template>
  <div
    class="quest-card"
    :class="taskStatusClasses"
    @click="openTasksModal(props.questInfo, questImageSrc)"
    :style="cardStyleVars"
  >
    <div class="quest-card__img">
      <atomic-image
        :src="questImageSrc"
      />
    </div>

    <div class="quest-card__header" ref="headerRef">
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
      <div class="quest-card__title" ref="titleRef">
        {{ props.questInfo.name }}
      </div>

      <quest-progress
        v-if="![3,4].includes(props.questInfo.state)"
        :taskList="props.questInfo.tasks"
      />
    </div>

    <div v-if="[1,2].includes(props.questInfo.state)" class="quest-card__actions">
      <button-base
        v-if="props.questInfo.state === 1"
        size="sm"
        type="primary"
        @click.stop="activateQuest"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.startQuestButton') }}
      </button-base>

      <button-base
        v-else
        size="xs"
        type="ghost"
        @click.stop="cancelQuest"
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

  const { openTasksModal } = useQuestsStore();
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
    'is-completed': [3,4].includes(props.questInfo?.state),
    'is-expired is-bw-enabled': [5,6].includes(props.questInfo?.state)
  }));

  const questImageSrc = computed(() => {
    return questImages.value[questImages.value.length - (props.questIndex % questImages.value.length)]
      || '/img/quests/default-quest-img.png'
  })

  const { showAlert } = useLayoutStore();
  const activation = ref(false);
  const canceling = ref(false);
  const { activatePlayerQuest, cancelPlayerQuest } = useCoreQuestApi();
  const activateQuest = async (): Promise<void> => {
    if (activation.value) return;
    activation.value = true;

    try {
      await activatePlayerQuest(props.questInfo.id);
      await nextTick(() => {
        const titleWidth = getComputedStyle(titleRef.value).width as any;
        const headerWidth = getComputedStyle(headerRef.value).width as any;
        titleRef.value.style.paddingRight = `${titleWidth - headerWidth}px`;
      })
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      activation.value = false;
    }
  }

  const cancelQuest = async (): Promise<void> => {
    if (canceling.value) return;
    canceling.value = true;

    try {
      await cancelPlayerQuest(props.questInfo.id);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      canceling.value = false;
    }
  }
  
  const titleRef = ref();
  const headerRef = ref();
  const cardStyleVars = ref<string>('');
  
  onMounted(() => {
    nextTick(() => {
      cardStyleVars.value = `--title-padding-right: ${titleRef.value?.clientWidth - headerRef.value?.clientWidth}px;--btn-primary-offset: ${titleRef.value?.clientHeight / 2 }px`
    })
  })
</script>

<style src="~/assets/styles/components/quest/card.scss" lang="scss"/>
