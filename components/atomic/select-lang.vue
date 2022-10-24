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
        <atomic-icon id="arrow_expand-close" />
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
        <atomic-icon id="check" />
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
  const cookieLanguage = useCookie('user-language', { maxAge: 60 * 60 * 24 * 365 * 10 });

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
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587; https://github.com/vuejs/core/issues/5844
    setTimeout(() => {
      document.addEventListener('click', checkLanguageDropdown);
    }, 300);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', checkLanguageDropdown);
  });
</script>

<style lang="scss">
.select-lang {
  position: relative;

  .selected, .item {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
    text-decoration: none;
    @include font($body-2);
  }

  .selected {
    background-color: var(--bg, transparent);
    transition: background-color .2s ease-in-out;
    color: var(--gray-300);
    border-radius: 8px;
    cursor: pointer;
    padding: rem(8px) rem(8px) rem(8px) rem(16px);
    margin-right: rem(-8px);

    .is-compact & {
      @include media(l) {
        padding-left: rem(8px);
      }
    }

    .icon {
      transform: var(--rotate, rotate(0deg));
      transition: all .2s ease-in-out;
      --color: var(--gray-400);
    }

    &:hover {
      --color: var(--white);

      .icon {
        --color: var(--white);
      }
    }
  }

  &.is-open {
    .selected {
      --bg: var(--gray-700);
      --rotate: rotate(180deg);
    }

    --items-visibility: visible;
    --items-opacity: 1;
  }

  .item {
    color: var(--color, var(--white));
    background-color: var(--bg, transparent);
    cursor: pointer;
    padding: rem(8px);
    border-radius: 4px;

    .icon {
      --color: transparent;
    }

    &.is-selected {
      .icon {
        --color: var(--white);
      }
    }

    &:hover {
      &:not(.is-selected) {
        --bg: var(--gray-600);

        .title {
          --color: var(--yellow-600);
        }
      }
    }
  }

  .items {
    position: absolute;
    background-color: var(--gray-700);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    visibility: var(--items-visibility, hidden);
    opacity: var(--items-opacity, 0);
    transition: all .2s ease-in-out;
    min-width: rem(40px);
    padding: var(--padding, #{rem(8px)});
    top: var(--top, #{rem(44px)});
    right: rem(-8px);
    left: 0;

    .is-compact & {
      @include media(l) {
        z-index: 1;
        --padding: 0;
      }
    }

    .title {
      --color: var(--white);
    }
  }

  .title {
    color: var(--color, var(--gray-300));
    @include font($body-1);
    flex-grow: 1;
    transition: color .2s ease-in-out;
    visibility: var(--title-visibility, visible);

    .is-compact & {
      @include media(l) {
        --title-visibility: hidden;
      }
    }
  }

  .img {
    display: block;
    width: rem(24px);
    height: rem(20px);
    flex: none;
    order: 0;
    flex-grow: 0;
    border-radius: 4px;
  }
}
</style>
