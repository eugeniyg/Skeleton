<template>
  <div class="panel-mode">
    <span class="title">{{ isRealMode ? 'Ready to go big?' : 'Ready to play for real?'}}</span>
    <button-base type="primary" size="sm" @click="clickButton">{{ isRealMode ? 'Yes, I’m ready' : 'Yes, play for real'}}</button-base>

    <div class="switch">
      <form-input-toggle
        v-model:value="isRealMode"
        @change="emit('changeMode')"
        name="real-mode"
        ref="toggler"
      />
      <div class="switch-label" @click="emit('changeMode')">Real mode</div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
