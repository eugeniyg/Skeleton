<template>
  <nav class="nav-user">
    <atomic-avatar-user v-bind="props.avatarItems"/>

    <div class="items">
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="item"
        :class="{ 'is-active': $route.path === localizePath(item.url) }"
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
          url: '/profile/wallet',
        },
        {
          icon: 'ui-bonus',
          title: 'Bonuses',
          url: '/profile/bonuses',
        },
        {
          icon: 'ui-user',
          title: 'Profile info',
          url: '/profile/info',
        },
        {
          icon: 'ui-history',
          title: 'History',
          url: '/profile/history',
        },
      ],
    },
  });
  const emit = defineEmits(['logout']);
  const { localizePath } = useProjectMethods();
  const { closeUserNav } = useLayoutStore();

  function clickItem(url: string):void {
    const router = useRouter();
    router.push(localizePath(url));
    closeUserNav();
  }
</script>

<style lang="scss" src="./style.scss"/>
