<template>
  <div class="drawer" :class="{'is-compact' : props.isCompact}">
    <div class="header">
      <button-toggle-drawer @toggle-minimize="emit('compact')" @toggle-open="$emit('toggle-open')"/>
      <button-toggler :items="sidebarContent?.gamesToggler"/>
    </div>

    <div class="content">
      <client-only>
        <template v-if="props.isLoggedIn">
          <card-profile/>
          <atomic-divider/>
        </template>
      </client-only>
      <nav-list :items="sidebarContent?.topMenu"/>
      <atomic-divider/>
      <nav-list :items="sidebarContent?.tokenMenu"/>
      <atomic-divider/>
      <nav-list :items="sidebarContent?.bonusesMenu"/>
      <atomic-divider/>
      <template v-if="props.isLoggedIn">
        <nav-list  :items="sidebarContent?.userMenu"/>
        <atomic-divider/>
      </template>
      <atomic-select-lang/>
      <atomic-divider/>
      <nav-list :items="sidebarContent?.bottomMenu"/>
      <atomic-divider/>
      <nav-static :items="sidebarContent?.sidebarFooterMenu"/>
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
  const { sidebarContent } = useGlobalStore();
  const emit = defineEmits(['compact', 'toggleOpen']);
</script>

<style lang="scss" src="./style.scss"/>
