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
  import { GamePageInterface } from '~/types';

  const props = defineProps<{
    gameContent: GamePageInterface
  }>();

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

<style lang="scss">
.panel-mode {
  display: flex;
  background-color: var(--gray-900);
  padding: rem(8px) rem(16px);
  align-items: center;
  grid-column-gap: rem(8px);
  user-select: none;

  .title {
    @include font($body-2);
    color: var(--gray-300);
  }

  .btn-primary {
    margin-right: auto;
  }

  .switch {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
  }

  .switch-label {
    @include font($heading-2);
    color: var(--gray-300);
  }
}
</style>
