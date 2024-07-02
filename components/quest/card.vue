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

      <quest-timer v-if="props.questInfo.endAt" :expiredAt="props.questInfo.endAt" />
    </div>

    <div class="quest-card__body">
      <div class="quest-card__title">
        {{ props.questInfo.name }}
      </div>

<!--      <quest-progress-->
<!--        v-if="props.task?.progress && props.showProgressBar"-->
<!--        v-bind="props.task.progress"-->
<!--      />-->
    </div>

<!--    <div v-if="props.showActions" class="quest-card__actions">-->
<!--      <button-base v-if="isActive" size="xs" type="ghost">Cancel</button-base>-->
<!--      <button-base v-else size="sm" type="primary" @click="isActive = true">Go</button-base>-->
<!--    </div>-->
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
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const questImages = computed(() => {
    const imgObjArr: { src: string }[] = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.questsImages') || [];
    return imgObjArr.map(imgObj => imgObj.src);
  })

  const taskStatusClasses = computed(() => ({
    'is-active': props.questInfo?.state === 1 || props.questInfo?.state === 2,
    'is-completed': props.questInfo?.state === 3 || props.questInfo?.state === 4,
    'is-expired': props.questInfo?.state === 5 || props.questInfo?.state === 6
  }));
</script>

<style src="~/assets/styles/components/quest/card.scss" lang="scss"/>