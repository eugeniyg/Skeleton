<template>
  <div class="select-lang" :class="{ 'is-open': isOpen }">
    <client-only>
      <div class="selected" @click="toggleOpen">
        <img
          class="img"
          :src="`/img/flags/${languageFlagsMap[currentLocale.code.toLowerCase()]}.svg`"
          alt=""
        />
        <span class="title">{{ currentLocale.nativeName }}</span>
        <atomic-icon id="ui-arrow_expand-close" />
      </div>
    </client-only>

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
        <span class="title">{{ locale.nativeName }}</span>
        <atomic-icon id="ui-check" />
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { LocaleInterface } from '@platform/frontend-core/dist/module';

  const languageFlagsMap = {
    uk: 'ua',
    ru: 'ru',
    en: 'us',
  };

  const route = useRoute();
  const globalStore = useGlobalStore();
  const { locales, currentLocale } = storeToRefs(globalStore);
  const isOpen = ref<boolean>(false);
  const cookieLanguage = useCookie('user-language');

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

  const checkLanguageDropdown = (e:any):void => {
    if (!e.target.closest('.select-lang')) isOpen.value = false;
  };

  onMounted(() => {
    setTimeout(() => {
      document.addEventListener('click', checkLanguageDropdown);
    }, 100);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', checkLanguageDropdown);
  });
</script>

<style lang="scss" src="./style.scss"/>
