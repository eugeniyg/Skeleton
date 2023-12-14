<template>
  <div
    class="select-lang"
    :class="{ 'is-open': isOpen }"
  >
    <div class="select-lang__wrap" v-click-outside="closeSelect">
      <div class="selected" @click="toggleOpen">
        <atomic-image
          class="img"
          :src="`${gamehubCdn}/locales/${currentLocale.code.toLowerCase()}.svg`"
        />
        <span class="title">{{ currentLocale.nativeName || currentLocale.name }}</span>
        <atomic-icon id="arrow_expand-close" />
      </div>

      <div
        class="items"
        body-scroll-lock-ignore
      >
        <div
          class="item"
          v-for="locale in locales"
          :key="locale.code"
          :class="{ 'is-selected': currentLocale?.code.toLowerCase() === locale.code.toLowerCase() }"
          @click="changeLanguage(locale)"
        >
          <atomic-image class="img" :src="`${gamehubCdn}/locales/${locale.code.toLowerCase()}.svg`" />
          <span class="title">{{ locale.nativeName || locale.name }}</span>
          <atomic-icon id="check" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ILocale } from '@skeleton/core/types';

  const route = useRoute();
  const globalStore = useGlobalStore();
  const { locales, currentLocale } = storeToRefs(globalStore);
  const isOpen = ref<boolean>(false);
  const isProcess = ref<boolean>(false);
  const cookieLanguage = useCookie('user-language', { maxAge: 60 * 60 * 24 * 365 * 10 });
  const { changeProfileData } = useCoreProfileApi();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { public: { gamehubCdn } } = useRuntimeConfig();

  const changeLanguage = async (locale: ILocale): Promise<void> => {
    if (currentLocale.value?.code === locale.code || isProcess.value) return;
    isOpen.value = false;
    isProcess.value = true;

    cookieLanguage.value = locale.code.toLowerCase();

    if (isLoggedIn.value) {
      await changeProfileData({ locale: locale.code })
    }

    window.location.href = linkToLocale(locale);
  };

  const linkToLocale = (locale: ILocale):string => {
    const routerLocale:any = route.params.locale;

    if (locale.isDefault) {
      const deleteLocale = route.fullPath.replace(`/${routerLocale}`, '');
      return deleteLocale || '/';
    }

    if (routerLocale) {
      return route.fullPath.replace(routerLocale, locale.code.toLowerCase());
    }
    return `/${locale.code.toLowerCase()}${route.fullPath === '/' ? '' : route.fullPath}`;
  };

  const toggleOpen = (): void => {
    if (isProcess.value) return;
    isOpen.value = !isOpen.value;
  };

  const closeSelect = ():void => {
    if (isOpen.value) isOpen.value = false;
  };
</script>

<style src="~/assets/styles/components/atomic/select-lang.scss" lang="scss" />
