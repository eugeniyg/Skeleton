<template>
  <div class="promo">
    <div class="header">
      <div class="title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'registration.promo.title') }}
      </div>

      <span class="sub-title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'registration.promo.secondTitle') }}
      </span>

      <span class="sub-title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'registration.promo.additionalTitle') }}
      </span>
    </div>

    <div v-if="advantagesList?.length" class="items">
      <div
        v-for="(advantage, index) in advantagesList"
        :key="index"
        class="item"
      >
        <atomic-icon :id="advantage.icon"/>{{ advantage.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const advantagesList = computed(() => {
    if (popupsData?.registration?.promo?.advantages?.length) return popupsData.registration.promo.advantages;
    return defaultLocalePopupsData?.registration?.promo?.advantages || [];
  });
</script>

<style src="~/assets/styles/components/atomic/promo.scss" lang="scss" />
