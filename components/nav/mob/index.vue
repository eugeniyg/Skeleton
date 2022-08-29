<template>
  <div class="nav-mob">
    <button-base class="item" @click.prevent="layoutStore.toggleDrawer()">
      <atomic-icon :id="'menu'" /><span>{{mobileMenuContent?.menuLabel}}</span>
    </button-base>

    <button-base
      v-if="mobileMenuContent?.items?.[0]"
      class="item"
      :class="{ active: $route.path === localizePath(mobileMenuContent.items[0].url)}"
      @click="clickItem(mobileMenuContent.items[0].url)"
    >
      <atomic-icon :id="mobileMenuContent.items[0].icon" /><span>{{ mobileMenuContent.items[0].label }}</span>
    </button-base>

    <button-base class="item is-accent" @click.prevent="clickMainButton">
      <client-only>
        <atomic-icon :id="isLoggedIn ? 'wallet' : 'user'" />
        <span>{{isLoggedIn ? headerContent?.depositButton : headerContent?.loginButton }}</span>
      </client-only>
    </button-base>

    <button-base
      v-for="link in mobileMenuContent?.items?.slice(1)"
      :key="link.url"
      class="item"
      :class="{ active: $route.path === localizePath(link.url) }"
      @click="clickItem(link.url)"
    >
      <atomic-icon :id="link.icon" /><span>{{ link.label }}</span>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const router = useRouter();
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();
  const { mobileMenuContent, headerContent } = useGlobalStore();
  const { localizePath } = useProjectMethods();
  const clickItem = (url: string):void => {
    if (url === '/betting') {
      isLoggedIn.value ? router.push(localizePath(url)) : showModal('register');
    } else router.push(localizePath(url));
  };

  const clickMainButton = ():void => {
    isLoggedIn.value ? openDepositModal() : showModal('signIn');
  };
</script>

<style lang="scss" src="./style.scss" />
