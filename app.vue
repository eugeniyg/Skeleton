<template>
  <div class="main-layout">
    <Head>
      <Title>Slotsbet</Title>
      <Meta name="description" content="Platform Project" />
      <Link
        rel="icon"
        type="image/svg"
        sizes="16x16"
        href="/favicon/logo-short.svg"
      />
    </Head>

    <layout-header
      :is-logged-in="isLoggedIn"
      @login="login"
      @logout="logout"
      @register="showModal('register')"
    />

    <layout-drawer :is-logged-in="isLoggedIn" :is-compact="isDrawerCompact" @compact="compact"/>

    <main class="app-main" :class="{'is-overflow': globalMethods.isHomePage()}">
      <NuxtPage class="app-page" :class="`page--${$route.name}`"/>
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <nav-mob />

    <client-only>
      <modal-register />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { getCurrencies, getLocales, getCountries } = useGlobalStore();
  useAsyncData('currencies', getCurrencies);
  useAsyncData('locales', getLocales);
  useAsyncData('countries', getCountries);

  const layoutStore = useLayoutStore();
  const userStore = useUserStore();
  const globalMethods = useGlobalMethods();

  const { isDrawerCompact } = storeToRefs(layoutStore);
  const { compactDrawer, showModal } = layoutStore;

  const { logIn, logOut } = userStore;
  const { isLoggedIn } = storeToRefs(userStore);

  const route = useRoute();
  if (route.query['sign-up']) {
    showModal('register');
  }

  function login():void {
    logIn();
  }

  function logout():void {
    logOut();
  }

  function compact():void {
    compactDrawer();
  }
</script>

<style lang="scss">
@import "@/scss/style.scss";
</style>
