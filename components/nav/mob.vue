<template>
  <div class="nav-mob">
    <button-base class="item" @click.prevent="layoutStore.toggleDrawer()">
      <atomic-icon :id="'menu'" /><span>
        {{ getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'menuLabel') }}
      </span>
    </button-base>

    <button-base
      v-if="getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0')"
      class="item"
      :class="{ active: $route.path === localizePath(getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.url')) || $route.query.category}"
      @click="clickItem(getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.url'))"
    >
      <atomic-icon
        :id="getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.icon')"
      /><span>{{ getContent(mobileMenuContent, defaultLocaleMobileMenuContent, 'items.0.label') }}</span>
    </button-base>

    <button-base class="item is-accent" @click.prevent="clickMainButton">
      <atomic-icon :id="isLoggedIn ? 'wallet' : 'user'" />
      <span>
        {{ isLoggedIn ? headerContent?.depositButton || defaultLocaleHeaderContent?.depositButton
          : headerContent?.loginButton || defaultLocaleHeaderContent?.loginButton }}
      </span>
    </button-base>

    <button-base
      v-for="link in linksList?.slice(1)"
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
  const {
    mobileMenuContent,
    defaultLocaleMobileMenuContent,
    headerContent,
    defaultLocaleHeaderContent,
  } = useGlobalStore();
  const { localizePath, getContent } = useProjectMethods();
  const clickItem = (url: string):void => {
    if (url === '/betting') {
      isLoggedIn.value ? router.push(localizePath(url)) : showModal('register');
    } else router.push(localizePath(url));
  };

  const clickMainButton = ():void => {
    isLoggedIn.value ? openDepositModal() : showModal('signIn');
  };

  const linksList = computed(() => {
    if (mobileMenuContent?.items?.length) return mobileMenuContent.items;
    return defaultLocaleMobileMenuContent?.items || [];
  });
</script>

<style src="~/assets/styles/components/nav/mob.scss" lang="scss" />

