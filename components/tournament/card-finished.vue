<template>
  <div class="tournament-card-finished">
    <div class="tournament-card-finished__container">
      <div class="tournament-card-finished__header">
        <span class="tournament-card-finished__badge">Finished</span>
        <span class="tournament-card-finished__date">End Date - 18.09.2024</span>
      </div>
      
      <div class="tournament-card-finished__content">
        <div class="tournament-card-finished__title">{{ props.title }}</div>
        <div class="tournament-card-finished__sub-title">{{ props.subTitle }}</div>
      </div>
      
      <atomic-image class="tournament-card-finished__img" :src="props.image"/>
      
<!--      <div class="tournament-card-finished__actions">-->
<!--        <button-base type="secondary" size="md">Results</button-base>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    subTitle: string;
    image: string;
    startedAt: string;
    expiredAt: string;
  }>();
</script>

<style src="~/assets/styles/components/tournament/card-finished.scss" lang="scss"/>
