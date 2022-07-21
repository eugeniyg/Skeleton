<template>
  <div :class="['main-layout', {'drawer-minimize': IS_DRAWER_COMPACT}]">
    <Head>
      <Title>Slotsbet</Title>
      <Meta name="description" content="Platform Project" />
      <Meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, user-scalable=0" />
      <Link
        rel="icon"
        type="image/svg"
        sizes="16x16"
        href="/favicon/logo-short.svg"
      />
    </Head>

    <atomic-preloader/>

    <layout-header
      :is-logged-in="isLoggedIn"
      @logout="logout"
    />

    <layout-drawer
      :is-logged-in="isLoggedIn"
      :is-compact="IS_DRAWER_COMPACT"
      @compact="compact"
      @toggle-open="toggleOpen"
    />

    <main class="app-main" :class="{'is-overflow': isHomePage()}">
      <slot/>
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <nav-mob />

    <transition name="fade-down">
      <layout-cookies v-if="showCookiesMessage" />
    </transition>

    <client-only>
      <modal-register />
      <modal-sign-in />
      <modal-forgot-pass />
      <modal-deposit />
      <modal-withdraw />
      <modal-success />
      <modal-error />
    </client-only>

    <atomic-alert
      :isShow="isShowAlert"
      v-bind="alertProps"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  useHead({
    bodyAttrs: {
      class: 'stop-transition',
    },
  });

  const cookieLanguage = useCookie('user-language');
  const route = useRoute();

  if (route.name && !route.params.locale && cookieLanguage.value) {
    navigateTo(`/${cookieLanguage.value}${route.fullPath === '/' ? '' : route.fullPath}`);
  }

  const {
    getCurrencies,
    getLocales,
    getCountries,
    getValidationMessages,
    getCommonData,
    getFieldsContent,
  } = useGlobalStore();
  const { getRegistrationFields } = useProfileStore();
  const { getGameProviders, getGameCollections } = useGamesStore();

  useAsyncData('currencies', getCurrencies);
  useAsyncData('locales', getLocales);
  useAsyncData('countries', getCountries);
  useAsyncData('registrationFields', getRegistrationFields);
  useAsyncData('collections', getGameCollections);
  useAsyncData('providers', getGameProviders);
  useLazyAsyncData('validationMessages', getValidationMessages);
  useLazyAsyncData('fieldsContent', getFieldsContent);
  useLazyAsyncData('commonData', getCommonData);

  const IS_DRAWER_COMPACT = useCookie<boolean>('IS_DRAWER_COMPACT');
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isHomePage, localizePath } = useProjectMethods();

  const { isShowAlert, alertProps, showCookiePopup } = storeToRefs(layoutStore);
  const { compactDrawer, checkModals } = layoutStore;
  checkModals();

  const { logOutUser } = profileStore;
  const { isLoggedIn } = storeToRefs(profileStore);

  function logout():void {
    logOutUser();
  }

  function compact():void {
    IS_DRAWER_COMPACT.value = !IS_DRAWER_COMPACT.value;
    compactDrawer();
  }

  function toggleOpen():void {
    layoutStore.toggleDrawer();
  }

  const showCookiesMessage = computed(() => showCookiePopup.value
    && route.name !== 'games-id'
    && route.name !== 'locale-games-id'
    && route.path !== localizePath('/betting'));

  const timer = ref<any>();
  onMounted(() => {
    document.body.classList.remove('stop-transition');

    const cookieValue = useCookie('accept-cookie');
    if (!cookieValue.value) {
      timer.value = setTimeout(() => {
        showCookiePopup.value = true;
      }, 1500);
    }
  });

  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });
</script>

<style lang="scss">
@import "@/scss/style.scss";
</style>
