<template>
  <div class="loyalty-progress" :class="{ 'loyalty-progress--short': props.shortVersion }">
    <div class="loyalty-progress__prev">
      <span v-if="props.shortVersion" class="loyalty-progress__prev-label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.levelLabel') }}:
      </span>

      <atomic-image class="loyalty-progress__prev-icon" :src="currentLevelIcon" />

      <span class="loyalty-progress__prev-value">
        {{ currentLevelName }}
      </span>
    </div>

    <div v-if="loyaltyAccount?.nextLevel" class="loyalty-progress__next">
      <span class="loyalty-progress__next-label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.nextLabel') }}:
      </span>

      <atomic-image class="loyalty-progress__next-icon" :src="nextLevelIcon" />

      <span class="loyalty-progress__next-value">
        {{ nextLevelName }}
      </span>
    </div>

    <div class="loyalty-progress__bar">
      <span class="loyalty-progress__bar-line" :style="{ width: `${currentLevelProgress}%` }" />
    </div>

    <div class="loyalty-progress__points">
      <div class="loyalty-progress__points-prev">
        <span class="loyalty-progress__points-prev-value">
          {{ currentPoints }}
        </span>

        <span class="loyalty-progress__points-prev-label">
          {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.pointsLabel') }}
        </span>
      </div>

      <template v-if="loyaltyAccount?.nextLevel">
        <div class="loyalty-progress__points-divider">/</div>

        <div class="loyalty-progress__points-next">
          <span class="loyalty-progress__points-next-value">
            {{ nextLevelPoints }}
          </span>

          <span class="loyalty-progress__points-next-label">
            {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.pointsLabel') }}
          </span>
        </div>
      </template>

      <atomic-icon
        v-if="props.showInfo"
        id="info"
        class="loyalty-progress__points-info"
        @click="openModal('loyalty-earn')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    showInfo?: boolean;
    shortVersion?: boolean;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const { openModal } = useModalStore();
  const loyaltyStore = useLoyaltyStore();
  const { loyaltyAccount, currentLevelName, nextLevelName, currentPoints, nextLevelPoints, currentLevelProgress } =
    storeToRefs(loyaltyStore);

  const currentLevelIcon = computed(() => {
    return (
      getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'loyalty.currentLevelIcon'
      ) || '/img/loyalty/default-current-level-icon.png'
    );
  });

  const nextLevelIcon = computed(() => {
    return (
      getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'loyalty.nextLevelIcon') ||
      '/img/loyalty/default-next-level-icon.png'
    );
  });
</script>

<style src="~/assets/styles/components/loyalty/progress.scss" lang="scss" />
