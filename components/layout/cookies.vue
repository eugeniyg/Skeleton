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

<style src="~/assets/styles/components/layout/cookies.scss" lang="scss" />

