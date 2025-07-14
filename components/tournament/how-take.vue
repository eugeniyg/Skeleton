<template>
  <div class="tournament-how-take">
    <div v-if="title" class="tournament-how-take__title">{{ title }}</div>

    <div v-if="list.length" class="tournament-how-take__items">
      <div v-for="(item, index) in list" :key="index" class="tournament-how-take__item">
        <span class="tournament-how-take__number">{{ index + 1 }}</span>
        <p class="tournament-how-take__text">{{ item.label }}</p>
      </div>
    </div>

    <atomic-image v-if="image" :src="image" />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentsPage } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<ITournamentsPage['howTake']>;
    defaultLocaleData: Maybe<ITournamentsPage['howTake']>;
  }>();

  const title = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'title');
  });

  const list = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'items') || [];
  });

  const image = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'image');
  });
</script>

<style src="~/assets/styles/components/tournament/how-take.scss" lang="scss" />
