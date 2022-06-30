<template>
  <div class="nav-mob">
    <nuxt-link
      v-for="({ title, icon, href, isAccent, method }, itemIndex) in items"
      :key="itemIndex"
      class="item"
      :class="{ 'is-accent': isAccent }"
      @click.prevent="clickItem(method)"
      :to="href !== '/betting' && href"
    >
      <client-only>
        <atomic-icon :id="icon" /><span>{{ title }}</span>
      </client-only>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const router = useRouter();
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();

  const items = computed(() => [
    {
      title: 'Menu',
      icon: 'ui-menu',
      method: 'toggleDrawer',
    },
    {
      title: 'Casino',
      icon: 'cherry',
      href: '/main',
    },
    {
      title: isLoggedIn.value ? 'Deposit' : 'Login',
      icon: isLoggedIn.value ? 'ui-wallet' : 'ui-user',
      isAccent: true,
      method: 'openModal',
    },
    {
      title: 'Sport',
      icon: 'sport',
      href: '/betting',
      method: 'toBetting',
    },
    {
      title: 'Support',
      icon: 'live-support',
      href: '/contact',
    },
  ]);

  // eslint-disable-next-line no-unused-vars
  function toggleDrawer(): void {
    layoutStore.toggleDrawer();
  }

  function clickItem(method?: string): void {
    if (method) {
      if (method === 'openModal') {
        isLoggedIn.value ? openDepositModal() : showModal('signIn');
      }
      if (method === 'toBetting') {
        isLoggedIn.value ? router.push('/betting') : showModal('signIn');
      } else {
        layoutStore[method]();
      }
    }
  }
</script>

<style lang="scss" src="./style.scss" />
