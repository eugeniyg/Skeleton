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
      @login="showModal('signIn')"
      @logout="logout"
      @register="showModal('register')"
    />

    <layout-drawer :is-logged-in="isLoggedIn" :is-compact="isDrawerCompact" @compact="compact"/>

    <main class="app-main" :class="{'is-overflow': projectMethods.isHomePage()}">
      <NuxtPage class="app-page" :class="`page--${$route.name}`"/>
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <nav-mob />

    <client-only>
      <modal-register />
      <modal-sign-in />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const {
    getCurrencies, getLocales, getCountries, getValidationMessages, getCommonData,
  } = useGlobalStore();
  const { getRegistrationFields } = useUserStore();
  useAsyncData('currencies', getCurrencies);
  useAsyncData('locales', getLocales);
  useAsyncData('countries', getCountries);
  useAsyncData('registrationFields', getRegistrationFields);
  useLazyAsyncData('validationMessages', getValidationMessages);
  useLazyAsyncData('commonData', getCommonData);

  const layoutStore = useLayoutStore();
  const userStore = useUserStore();
  const projectMethods = useProjectMethods();

  const { isDrawerCompact } = storeToRefs(layoutStore);
  const { compactDrawer, showModal, closeModal } = layoutStore;

  const { logOutUser } = userStore;
  const { isLoggedIn } = storeToRefs(userStore);

  const route = useRoute();
  if (route.query['sign-up']) {
    isLoggedIn.value ? closeModal('register') : showModal('register');
  } else if (route.query['sign-in']) {
    isLoggedIn.value ? closeModal('signIn') : showModal('signIn');
  }

  function logout():void {
    logOutUser();
  }

  function compact():void {
    compactDrawer();
  }
</script>

<style lang="scss">
@import "@/scss/style.scss";
</style>
