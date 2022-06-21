<template>
  <div class="drawer" :class="{'is-compact' : props.isCompact}">
    <div class="header">
      <button-toggle-drawer @toggle="emit('compact')" :is-active="props.isCompact"/>
      <button-toggler :items="fakeStore.togglerBtnItems" :is-compact="props.isCompact"/>
    </div>

    <div class="content">
      <template v-if="props.isLoggedIn">
        <card-profile :is-compact="props.isCompact"/>
        <atomic-divider/>
      </template>
      <nav-list :items="fakeStore.topMenuItems" :is-compact="props.isCompact"/>
      <atomic-divider/>
      <nav-list :items="fakeStore.centerMenuItems" :is-compact="props.isCompact"/>
      <atomic-divider/>
      <atomic-select-lang/>
      <atomic-divider/>
      <nav-list :items="fakeStore.bottomMenuItems" :is-compact="props.isCompact"/>
      <atomic-divider/>
      <nav-static :items="fakeStore.staticMenuItems"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isCompact: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  });
  const fakeStore = useFakeStore();
  const emit = defineEmits(['compact']);
</script>

<style lang="scss" src="./style.scss"/>
