<template>
  <div class="drawer" :class="{'is-compact' : props.isCompact}">
    <div class="header">
      <button-toggle-drawer @toggle-minimize="emit('compact')" @toggle-open="$emit('toggle-open')"/>
      <button-toggler :items="fakeStore.togglerBtnItems"/>
    </div>

    <div class="content">
      <client-only>
        <template v-if="props.isLoggedIn">
          <card-profile/>
          <atomic-divider/>
        </template>
      </client-only>
      <nav-list :items="fakeStore.topMenuItems"/>
      <atomic-divider/>
      <nav-list :items="fakeStore.sbtTokenMenuItems"/>
      <atomic-divider/>
      <nav-list :items="fakeStore.centerMenuItems"/>
      <atomic-divider/>
      <nav-list :items="dynamicUserMenu"/>
      <atomic-divider/>
      <atomic-select-lang/>
      <atomic-divider/>
      <nav-list :items="fakeStore.bottomMenuItems"/>
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
  const emit = defineEmits(['compact', 'toggleOpen']);

  const profileStore = useProfileStore();
  const dynamicUserMenu = computed(() => {
    if (profileStore.isLoggedIn) return fakeStore.userMenuItems;
    return fakeStore.userMenuItems.filter((item) => item.href !== '/favorites');
  });
</script>

<style lang="scss" src="./style.scss"/>
