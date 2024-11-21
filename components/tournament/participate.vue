<template>
  <div class="tournament-participate">
    <div class="tournament-participate__content">
      <div class="tournament-participate__title">{{ props.content?.title }}</div>
      <div class="tournament-participate__prize">{{ props.content?.prize }}</div>
    </div>
    <div class="tournament-participate__actions">
      <button-base size="md" type="primary">{{ props.content?.button }}</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentPage } from '~/types';
  
  const props = defineProps<{
    content: ITournamentPage['participate'];
  }>();
</script>

<style src="~/assets/styles/components/tournament/participate.scss" lang="scss"/>
