<template>
  <div class="cookies">
    <div class="box">
      <atomic-icon id="cookies"/>
    </div>

    <div v-if="cookiePopupContent?.text" class="text" v-html="marked.parse(cookiePopupContent.text)" />
    <button-base type="primary" size="md" @click="acceptCookie">{{ cookiePopupContent?.acceptButton }}</button-base>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { cookiePopupContent } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const acceptCookie = ():void => {
    const userCookie = useCookie('accept-cookie', { maxAge: 60 * 60 * 24 * 365 * 10 });
    userCookie.value = 'accepted';
    layoutStore.showCookiePopup = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
