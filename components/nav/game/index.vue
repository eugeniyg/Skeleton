<template>
  <div class="nav-game">
    <nav-action :gameInfo="props.gameInfo" />
    <!--    <nav-mode :items="modeItems"/>-->
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    gameInfo: {
      type: Object,
      required: true,
    },
  });
  // const modeItems = [
  //   {
  //     icon: 'ui-device',
  //     id: 'device',
  //   },
  //   {
  //     icon: 'ui-device-split',
  //     id: 'device-split',
  //   },
  // ];
</script>

<style lang="scss" src="./style.scss"/>
