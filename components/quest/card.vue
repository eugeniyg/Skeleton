<template>
  <div
    class="quest-card"
    :class="taskStatusClasses"
    :style="cardStyleVars"
    @click="openTasksModal(props.questInfo, questImageSrc)"
  >
    <div class="quest-card__img">
      <atomic-image :src="questImageSrc" />
    </div>

    <div ref="headerRef" class="quest-card__header">
      <div class="quest-currencies">
        <quest-currency
          :currentLocaleContent="questsHubContent"
          :defaultLocaleContent="defaultLocaleQuestsHubContent"
          :rewards="props.questInfo.rewards"
          type="real"
        />

        <quest-currency
          :currentLocaleContent="questsHubContent"
          :defaultLocaleContent="defaultLocaleQuestsHubContent"
          :rewards="props.questInfo.rewards"
          type="virtual"
        />
      </div>

      <quest-timer
        v-if="[1, 2].includes(props.questInfo.state) && props.questInfo.endAt"
        :expired-at="props.questInfo.endAt"
      />
    </div>

    <div class="quest-card__body">
      <div ref="titleRef" class="quest-card__title">
        {{ props.questInfo.name }}
      </div>

      <quest-progress v-if="![3, 4].includes(props.questInfo.state)" :task-list="props.questInfo.tasks" />
    </div>

    <div v-if="[1, 2].includes(props.questInfo.state)" class="quest-card__actions">
      <button-base v-if="props.questInfo.state === 1" size="sm" type="primary" @click.stop="activateQuest">
        {{ activateQuestButton }}
      </button-base>

      <button-base v-else size="sm" type="ghost" @click.stop="cancelQuest">
        {{ getContent(questsHubContent, defaultLocaleQuestsHubContent, 'cancelQuestButton') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuest } from '@skeleton/core/types';
  import type { IQuestsHubModal } from '~/types';

  const props = defineProps<{
    questIndex: number;
    questInfo: IPlayerQuest;
  }>();

  const questsHubContent: Maybe<IQuestsHubModal> = inject('questsHubContent');
  const defaultLocaleQuestsHubContent: Maybe<IQuestsHubModal> = inject('defaultLocaleQuestsHubContent');

  const { openTasksModal } = useQuestsStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const questImages = computed(() => {
    const imgObjArr: { src: string }[] =
      getContent(questsHubContent, defaultLocaleQuestsHubContent, 'questsImages') || [];
    return imgObjArr.map(imgObj => imgObj.src);
  });

  const taskStatusClasses = computed(() => ({
    'is-active': [1, 2].includes(props.questInfo?.state),
    'is-completed': [3, 4].includes(props.questInfo?.state),
    'is-expired is-bw-enabled': [5, 6].includes(props.questInfo?.state),
  }));

  const questImageSrc = computed(() => {
    return (
      questImages.value[questImages.value.length - (props.questIndex % questImages.value.length)] ||
      '/img/quests/default-quest-img.png'
    );
  });

  const activateQuestButton = computed(() => {
    const isQuestCompleted = props.questInfo.tasks.every(task => task.isCompleted);
    return isQuestCompleted
      ? getContent(questsHubContent, defaultLocaleQuestsHubContent, 'claimReward')
      : getContent(questsHubContent, defaultLocaleQuestsHubContent, 'startQuestButton');
  });

  const { showAlert } = useLayoutStore();
  const activation = ref(false);
  const canceling = ref(false);
  const { activatePlayerQuest, cancelPlayerQuest } = useCoreQuestApi();
  const activateQuest = async (): Promise<void> => {
    if (activation.value) return;
    activation.value = true;

    try {
      await activatePlayerQuest(props.questInfo.id);
      useEvent('questActivated');
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      activation.value = false;
    }
  };

  const cancelQuest = async (): Promise<void> => {
    if (canceling.value) return;
    canceling.value = true;

    try {
      await cancelPlayerQuest(props.questInfo.id);
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
      canceling.value = false;
    }
  };

  const titleRef = ref();
  const headerRef = ref();
  const cardStyleVars = ref<string>('');

  onMounted(() => {
    nextTick(() => {
      cardStyleVars.value = `--title-padding-right: ${titleRef.value?.clientWidth - headerRef.value?.clientWidth}px;--btn-primary-offset: ${titleRef.value?.clientHeight / 2}px`;
    });
  });
</script>

<style src="~/assets/styles/components/quest/card.scss" lang="scss" />
