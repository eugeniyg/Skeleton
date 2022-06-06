<template>
  <div class="nav-game">
    <nav-action :items="actionItems"/>
    <!--    <nav-mode :items="modeItems"/>-->
  </div>
</template>

<script setup lang="ts">
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
  const actionItems = [
    {
      icon: 'ui-close',
      id: 'close',
    },
    {
      icon: 'ui-video-expand',
      id: 'full-screen',
    },
    {
      icon: 'ui-heart-outline',
      id: 'favorites',
    },
    // {
    //   icon: 'ui-winners',
    //   id: 'winners',
    // },
  ];
</script>

<style lang="scss" src="./style.scss"/>
