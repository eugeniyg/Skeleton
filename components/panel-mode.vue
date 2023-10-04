<template>
  <div class="panel-mode">
    <span class="title">
      {{ props.gameContent?.demoLabel }}
    </span>

    <button-base
      type="primary"
      size="sm"
      @click="clickButton"
    >
      {{ props.gameContent?.demoButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { IGamePage } from '~/types';

  const props = defineProps<{
    gameContent: IGamePage;
  }>();

  const emit = defineEmits(['changeMode']);
  const clickButton = ():void => {
    emit('changeMode');
  };
</script>

<style src="~/assets/styles/components/panel-mode.scss" lang="scss" />

