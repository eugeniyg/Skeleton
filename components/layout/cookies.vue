<template>
  <div class="cookies">
    <div class="box">
      <atomic-icon id="cookies" />
    </div>

    <div
      v-if="layoutData?.cookie?.text || defaultLocaleLayoutData?.cookie?.text"
      v-router-links
      class="text"
      v-html="descriptionContent"
    />

    <button-base type="primary" size="md" @click="acceptCookie">
      {{ layoutData?.cookie?.acceptButton || defaultLocaleLayoutData?.cookie?.acceptButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const layoutStore = useLayoutStore();
  const acceptCookie = (): void => {
    const userCookie = useCookie('accept-cookie', { maxAge: 60 * 60 * 24 * 365 * 10 });
    userCookie.value = 'accepted';
    layoutStore.showCookiePopup = false;
  };
  const descriptionContent = computed(() => {
    const contentText = layoutData?.cookie?.text || defaultLocaleLayoutData?.cookie?.text;
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parse(contentText) as string, { FORBID_TAGS: ['style'] });
  });
</script>

<style src="~/assets/styles/components/layout/cookies.scss" lang="scss" />
