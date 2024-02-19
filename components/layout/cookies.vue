<template>
  <div class="cookies">
    <div class="box">
      <atomic-icon id="cookies"/>
    </div>

    <div
      v-if="layoutData?.cookie?.text || defaultLocaleLayoutData?.cookie?.text"
      class="text"
      v-html="marked.parse(layoutData?.cookie?.text || defaultLocaleLayoutData?.cookie?.text || '')"
    />

    <button-base type="primary" size="md" @click="acceptCookie">
      {{ layoutData?.cookie?.acceptButton || defaultLocaleLayoutData?.cookie?.acceptButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const acceptCookie = ():void => {
    const userCookie = useCookie('accept-cookie', { maxAge: 60 * 60 * 24 * 365 * 10 });
    userCookie.value = 'accepted';
    layoutStore.showCookiePopup = false;
  };
</script>

<style src="~/assets/styles/components/layout/cookies.scss" lang="scss" />

