<template>
  <div class="nav-mob" v-if="!isGamePage || isGamePage && !isLoggedIn">
    <button-base class="nav-mob__item" @click.prevent="layoutStore.toggleDrawer()">
      <atomic-icon id="menu"/>
      <span class="nav-mob__text">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.menuLabel') }}
      </span>
    </button-base>

    <button-base
      v-if="getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.items.firstItem')"
      class="nav-mob__item"
      :class="{ active: $route.path === localizePath(getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.items.firstItem.url')) || $route.query.category }"
      @click="clickItem(getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.items.firstItem.url'))"
    >
      <atomic-icon
        :id="getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.items.firstItem.icon')"
      />
      <span class="nav-mob__text">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.items.firstItem.label') }}
      </span>
    </button-base>

    <button-base class="nav-mob__item is-accent" @click.prevent="clickMainButton">
      <atomic-icon :id="isLoggedIn ? 'wallet' : 'user-new'"/>
      <span class="nav-mob__text">
        {{ isLoggedIn ? getContent(layoutData, defaultLocaleLayoutData, 'header.depositButton')
        : getContent(layoutData, defaultLocaleLayoutData, 'header.registrationButton') }}
      </span>
    </button-base>

    <button-base
      v-for="link in linksList?.slice(1)"
      :key="link.url"
      class="nav-mob__item"
      :class="{ active: $route.path === localizePath(link.url) }"
      @click="clickItem(link.url)"
    >
      <atomic-icon :id="link.icon" />
      <span class="nav-mob__text">{{ link.label }}</span>
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
  const { isGamePage } = storeToRefs(layoutStore);
  const {
    layoutData,
    defaultLocaleLayoutData
  } = useGlobalStore();
  const { localizePath, getContent } = useProjectMethods();
  const clickItem = (url: string):void => {
    if (url === '/betting') {
      isLoggedIn.value ? router.push(localizePath(url)) : showModal('register');
    } else router.push(localizePath(url));
  };

  const clickMainButton = ():void => {
    isLoggedIn.value ? openDepositModal() : showModal('register');
  };

  const linksList = computed(() => {
    const currentLocaleItems = Object.values(layoutData?.mobileMenu?.items || {});
    const defaultLocaleItems = Object.values(defaultLocaleLayoutData?.mobileMenu?.items || {});
    if (currentLocaleItems.length) return currentLocaleItems;
    return defaultLocaleItems;
  });
</script>

<style src="~/assets/styles/components/nav/mob.scss" lang="scss" />

