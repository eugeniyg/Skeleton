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
      @logout="logout"
    />

    <layout-drawer :is-logged-in="isLoggedIn" :is-compact="isDrawerCompact" @compact="compact"/>

    <main class="app-main" :class="{'is-overflow': projectMethods.isHomePage()}">
      <slot/>
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <nav-mob />

    <client-only>
      <modal-register />
      <modal-sign-in />
      <modal-deposit />
      <modal-withdraw />
      <modal-success />
      <modal-error />
    </client-only>

    <atomic-alert
      v-if="alertProps.isShowAlert"
      :isShow="alertProps.isShowAlert"
      :title="alertProps.title"
      :text='alertProps.text'
      :variant="alertProps.variant"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const {
    getCurrencies, getLocales, getCountries, getValidationMessages, getCommonData, getFieldsContent,
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

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const projectMethods = useProjectMethods();

  const { isDrawerCompact, alertProps } = storeToRefs(layoutStore);
  const { compactDrawer, checkModals } = layoutStore;
  checkModals();

  const { logOutUser } = profileStore;
  const { isLoggedIn } = storeToRefs(profileStore);

  const route = useRoute();

  watch(() => route.path, (currPath, prevPath) => {
    if (currPath !== prevPath) {
      layoutStore.showAlert({
        isShowAlert: false,
        title: undefined,
        text: undefined,
        variant: undefined,
      });
    }
  });

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
