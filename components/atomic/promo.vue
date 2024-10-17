<template>
  <div class="promo" :class="{'promo--without-advantages': !isShowAdvantages}">
    <picture class="promo__picture">
      <source
        :srcset="getContent(popupsData, defaultLocalePopupsData, 'registration.promo.images.desktop.backgroundImage')"
        media="(min-width: 64rem)"
      >
      <atomic-image
        :src="getContent(popupsData, defaultLocalePopupsData, 'registration.promo.images.mobile.backgroundImage')"
        class="promo__picture-img"
      />
    </picture>

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

    <div v-if="advantagesList?.length && isShowAdvantages" class="items">
      <div
        v-for="(advantage, index) in advantagesList"
        :key="index"
        class="item"
      >
        <atomic-icon :id="advantage.icon"/>
        {{ advantage.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const advantagesList = computed(() => {
    return popupsData?.registration?.promo?.advantages || [];
  });

  const isShowAdvantages = computed(() => popupsData?.registration?.promo?.displayAdvantages);
</script>

<style src="~/assets/styles/components/atomic/promo.scss" lang="scss"/>
