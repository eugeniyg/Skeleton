<template>
  <div class="select-lang" :class="{ 'is-open': isOpen }">
    <div v-click-outside="closeSelect" class="select-lang__wrap">
      <div class="selected" @click="toggleOpen">
        <atomic-image class="img" :src="`${gamehubCdn}/locales/${currentLocale?.code.toLowerCase()}.svg`" />
        <span class="title">{{ currentLocale?.nativeName || currentLocale?.name }}</span>
        <atomic-icon id="arrow_expand-close" />
      </div>

      <div class="items" body-scroll-lock-ignore>
        <a
          v-for="locale in locales"
          :key="locale.code"
          class="item"
          :class="{ 'is-selected': currentLocale?.code.toLowerCase() === locale.code.toLowerCase() }"
          :href="linkToLocale(locale)"
          @click.prevent="changeLanguage(locale, $event)"
        >
          <atomic-image class="img" :src="`${gamehubCdn}/locales/${locale.code.toLowerCase()}.svg`" />
          <span class="title">{{ locale.nativeName || locale.name }}</span>
          <atomic-icon id="check" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  const {
    public: { gamehubCdn },
  } = useRuntimeConfig();

  const changeLanguage = async (locale: ILocale, event: any): Promise<void> => {
    if (currentLocale.value?.code === locale.code || isProcess.value) return;
    isOpen.value = false;
    isProcess.value = true;
    const href = event.currentTarget.attributes.href.value;
    cookieLanguage.value = locale.code.toLowerCase();

    if (isLoggedIn.value) {
      await changeProfileData({ locale: locale.code });
    }

    window.location.href = href || `/${locale.code.toLowerCase()}`;
  };

  const linkToLocale = (locale: ILocale): string => {
    const routerLocale: any = route.params.locale;
    const pathRegexp = new RegExp(`^/${routerLocale}/|^/${routerLocale}$`);
    const pathWithoutLocale = routerLocale ? route.fullPath.replace(pathRegexp, '/') : route.fullPath;

    if (locale.isDefault) return pathWithoutLocale;
    return `/${locale.code.toLowerCase()}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };

  const toggleOpen = (): void => {
    if (isProcess.value) return;
    isOpen.value = !isOpen.value;
  };

  const closeSelect = (): void => {
    if (isOpen.value) isOpen.value = false;
  };
</script>

<style src="~/assets/styles/components/atomic/select-lang.scss" lang="scss" />
