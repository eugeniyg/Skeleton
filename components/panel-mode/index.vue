<template>
  <div class="panel-mode">
    <span class="title">Ready to play for real?</span>
    <button-base type="primary" size="sm">Yes, play for real</button-base>
    <div class="switch">
      <form-input-toggle v-model:value="isRealMode" name="real-mode" ref="toggler"/>
      <div class="switch-label" @click="labelClick">Real mode</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const isRealMode = ref<boolean>(false);
  const labelClick = ():void => {
    isRealMode.value = !isRealMode.value;
  };
</script>

<style lang="scss" src="./style.scss"/>
