<template>
  <div
    class="select-lang"
    :class="{ 'is-open': isOpen }"
  >
    <div class="select-lang__wrap" v-click-outside="closeSelect">
      <div class="selected" @click="toggleOpen">
        <img
          class="img"
          :src="`/img/flags/${languageFlagsMap[currentLocale.code.toLowerCase()]}.svg`"
          alt=""
        />
        <span class="title">{{ currentLocale.nativeName || currentLocale.name }}</span>
        <atomic-icon id="arrow_expand-close" />
      </div>

      <div class="items">
        <component
          :is="currentLocale.code.toLowerCase() === locale.code.toLowerCase() ? 'div' : 'a'"
          class="item"
          v-for="locale in locales"
          :key="locale.code"
          :class="{ 'is-selected': currentLocale.code.toLowerCase() === locale.code.toLowerCase() }"
          :href="linkToLocale(locale)"
          @click="setCookie(locale)"
        >
          <img class="img" :src="`/img/flags/${languageFlagsMap[locale.code.toLowerCase()]}.svg`" alt="" />
          <span class="title">{{ locale.nativeName || locale.name }}</span>
          <atomic-icon id="check" />
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { LocaleInterface } from '@platform/frontend-core/dist/module';
  import { CookieRef } from '#app';

  const languageFlagsMap = {
    en: 'us',
    de: 'de',
    uk: 'ua',
  };

  const route = useRoute();
  const globalStore = useGlobalStore();
  const { locales, currentLocale } = storeToRefs(globalStore);
  const isOpen = ref<boolean>(false);
  const cookieLanguage:CookieRef<string|undefined> = useCookie('user-language', { maxAge: 60 * 60 * 24 * 365 * 10 });

  const setCookie = (locale: LocaleInterface):void => {
    if (locale.isDefault) cookieLanguage.value = undefined;
    else cookieLanguage.value = locale.code.toLowerCase();
  };

  const linkToLocale = (locale: LocaleInterface):string => {
    const routerLocale:any = route.params.locale;

    if (locale.isDefault) {
      const deleteLocale = route.fullPath.replace(`/${routerLocale}`, '');
      return deleteLocale || '/';
    }

    if (routerLocale) {
      return route.fullPath.replace(routerLocale, locale.code.toLowerCase());
    } return `/${locale.code.toLowerCase()}${route.fullPath === '/' ? '' : route.fullPath}`;
  };

  const toggleOpen = (): void => {
    isOpen.value = !isOpen.value;
  };

  const closeSelect = ():void => {
    if (isOpen.value) isOpen.value = false;
  };
</script>

<style src="~/assets/styles/components/atomic/select-lang.scss" lang="scss" />
