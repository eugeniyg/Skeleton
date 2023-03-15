<template>
  <div class="cookies">
    <div class="box">
      <atomic-icon id="cookies"/>
    </div>

    <div
      v-if="cookiePopupContent?.text || defaultLocaleCookiePopupContent?.text"
      class="text"
      v-html="marked.parse(cookiePopupContent?.text || defaultLocaleCookiePopupContent?.text)"
    />

    <button-base type="primary" size="md" @click="acceptCookie">
      {{ cookiePopupContent?.acceptButton || defaultLocaleCookiePopupContent?.acceptButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { cookiePopupContent, defaultLocaleCookiePopupContent } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const acceptCookie = ():void => {
    const userCookie = useCookie('accept-cookie', { maxAge: 60 * 60 * 24 * 365 * 10 });
    userCookie.value = 'accepted';
    layoutStore.showCookiePopup = false;
  };
</script>

<style lang="scss">
.cookies {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
  background-color: var(--gray-800);
  grid-column-gap: rem(16px);
  max-width: rem(680px);
  padding: rem(16px);
  border-radius: 8px;
  display: flex;
  position: fixed;
  bottom: rem(24px);
  left: rem(16px);
  right: 16px;
  z-index: 7;
  margin: 0 auto;

  .text {
    display: flex;
    align-items: center;
    color: var(--color, var(--white));
    @include font($body-1);

    @include media(md) {
      @include upd-font($body-2)
    }

    * {
      margin: 0;
      padding: 0;
    }

    a {
      text-decoration: none;
      color: var(--yellow-500);
    }
  }

  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    background-color: var(--gray-600);
    border-radius: 8px;
    min-width: rem(40px);
    min-height: rem(40px);
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .icon {
    --color: var(--white);
  }

  .size-md.btn-primary {
    align-self: center;
    --padding: #{rem(4px)} #{rem(16px)};
    @include upd-font($heading-1);
    --btn-border-radius: 8px;

    @include media(md) {
      --padding: #{rem(11px)} #{rem(24px)};
      @include upd-font($heading-2);
    }
  }
}
</style>
