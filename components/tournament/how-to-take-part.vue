<template>
  <div class="tournament-how-to-take-part">
      <div class="tournament-how-to-take-part__title">{{ content.label }}</div>
      
      <div class="tournament-how-to-take-part__items">
        <div v-for="(item, index) in items" :key="index" class="tournament-how-to-take-part__item">
          <span class="tournament-how-to-take-part__number">{{ index + 1 }}</span>
          <p class="tournament-how-to-take-part__text">{{ item }}</p>
        </div>
      </div>
    
      <atomic-image :src="props.content.image" />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentsPage } from '~/types';
  
  const props = defineProps<{
    content: ITournamentsPage['howToTakePart'];
  }>();
  
  const items = computed(() => [
    props.content?.first,
    props.content?.second,
    props.content?.third,
  ]);
</script>

<style src="~/assets/styles/components/tournament/how-to-take-part.scss" lang="scss" />
