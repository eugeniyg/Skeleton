<template>
  <nav class="nav-user">
    <atomic-avatar-user v-bind="props.avatarItems"/>

    <div class="items">
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="item"
        :class="{'is-active': globalMethods.getCurrentUrl === item.url}"
        @click="clickItem(item.url)"
      >
        <atomic-icon :id="item.icon"/>{{ item.title }}
      </div>
    </div>

    <atomic-divider/>
    <button-logout @logout="emit('logout')"/>
  </nav>
</template>

<script setup lang="ts">
  const props = defineProps({
    avatarItems: {
      type: Object,
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [
        {
          icon: 'ui-wallet',
          title: 'Wallet',
          url: '/user-profile/wallet',
        },
        {
          icon: 'ui-bonus',
          title: 'Bonuses',
          url: '/user-profile/bonuses',
        },
        {
          icon: 'ui-user',
          title: 'Profile info',
          url: '/user-profile/profile-info',
        },
        {
          icon: 'ui-history',
          title: 'History',
          url: '/user-profile/history',
        },
      ],
    },
  });
  const emit = defineEmits(['logout']);
  const globalMethods = useGlobalMethods();
  const layoutStore = useLayoutStore();
  const { closeUserNav } = layoutStore;

  function clickItem(url: string):void {
    globalMethods.navigate(url);
    closeUserNav();
  }
</script>

<style lang="scss" src="./style.scss"/>
