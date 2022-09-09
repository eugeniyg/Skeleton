<template>
  <div class="panel-mode">
    <span class="title">
      {{ isRealMode ? gameContent?.realLabel : gameContent?.demoLabel}}
    </span>

    <button-base
      type="primary"
      size="sm"
      @click="clickButton"
    >
      {{ isRealMode ? gameContent?.realButton : gameContent?.demoButton }}
    </button-base>

    <div class="switch">
      <form-input-toggle
        v-model:value="isRealMode"
        @change="emit('changeMode')"
        name="real-mode"
        ref="toggler"
      />

      <div class="switch-label" @click="emit('changeMode')">
        {{ gameContent?.switcherLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from '@vue/runtime-core';
  import { GamePageInterface } from '~/types';

  const props = defineProps({
    gameContent: {
      type: Object as PropType<GamePageInterface>,
      required: false,
    },
  });

  const route = useRoute();
  const isRealMode = ref<boolean>(route.query.demo !== 'true');
  const emit = defineEmits(['changeMode']);

  watch(() => route.query.demo, (newValue:string) => {
    isRealMode.value = newValue !== 'true';
  });

  const { openDepositModal } = useLayoutStore();
  const clickButton = ():void => {
    if (isRealMode.value) {
      openDepositModal();
    } else {
      emit('changeMode');
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
