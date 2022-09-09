<template>
  <div class="panel-mode">
    <span class="title">
      {{ isRealMode ? props.gameContent?.realLabel : props.gameContent?.demoLabel }}
    </span>

    <button-base
      type="primary"
      size="sm"
      @click="clickButton"
    >
      {{ isRealMode ? props.gameContent?.realButton : props.gameContent?.demoButton }}
    </button-base>

    <div class="switch">
      <form-input-toggle
        v-model:value="isRealMode"
        @change="emit('changeMode')"
        name="real-mode"
        ref="toggler"
      />

      <div class="switch-label" @click="emit('changeMode')">
        {{ props.gameContent?.switcherLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    gameContent?: {
      realLabel: string,
      realButton: string,
      demoLabel: string,
      demoButton: string,
      switcherLabel: string
    }
  }
  const props = defineProps<Props>();

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
