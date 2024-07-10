<template>
  <div class="loyalty-progress-display">
    <div class="loyalty-progress-display__prev">
      <span class="loyalty-progress-display__prev-label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.levelLabel') }}:
      </span>

      <atomic-image
        class="loyalty-progress-display__prev-icon"
        :src="currentLevelIcon"
      />

<!--      <atomic-icon id="flash" class="loyalty-progress-display__prev-icon"/>-->

      <span class="loyalty-progress-display__prev-value">
        {{ currentLevelName }}
      </span>
    </div>

    <div v-if="loyaltyAccount?.nextLevel" class="loyalty-progress-display__next">
      <span class="loyalty-progress-display__next-label">
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.nextLabel') }}:
      </span>

      <atomic-image
        class="loyalty-progress-display__next-icon"
        :src="nextLevelIcon"
      />
<!--      <atomic-icon id="flash" class="loyalty-progress-display__next-icon"/>-->

      <span class="loyalty-progress-display__next-value">
        {{ nextLevelName }}
      </span>
    </div>

    <loyalty-progress/>

    <div class="loyalty-progress-display__points">
      <div class="loyalty-progress-display__points-prev">
        <span class="loyalty-progress-display__points-prev-value">
          {{ currentPoints }}
        </span>

        <span class="loyalty-progress-display__points-prev-label">
          {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.pointsLabel') }}
        </span>
      </div>

      <template v-if="loyaltyAccount?.nextLevel">
        <div class="loyalty-progress-display__points-divider">/</div>

        <div class="loyalty-progress-display__points-next">
          <span class="loyalty-progress-display__points-next-value">
            {{ nextLevelPoints }}
          </span>

            <span class="loyalty-progress-display__points-next-label">
            {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'loyalty.pointsLabel') }}
          </span>
        </div>
      </template>

      <atomic-icon
        class="loyalty-progress-display__points-info"
        id="info"
        @click="showModal('loyaltyEarn')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = storeToRefs(globalStore);

  const { showModal } = useLayoutStore();
  const loyaltyStore = useLoyaltyStore();
  const {
    loyaltyAccount,
    currentLevelName,
    nextLevelName,
    currentPoints,
    nextLevelPoints
  } = storeToRefs(loyaltyStore);

  const currentLevelIcon = computed(() => {
    return getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'loyalty.currentLevelIcon')
      || '/img/loyalty/default-current-level-icon.png';
  });

  const nextLevelIcon = computed(() => {
    return getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'loyalty.nextLevelIcon')
      || '/img/loyalty/default-next-level-icon.png';
  });
</script>

<style src="~/assets/styles/components/loyalty/progress-display.scss" lang="scss" />