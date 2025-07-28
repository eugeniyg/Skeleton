<template>
  <div v-if="displayBar" ref="bar" class="notification-bar">
    <atomic-icon id="warning" class="notification-bar__icon" />
    <img v-if="barContentImg" :src="barContentImg" alt="" class="notification-bar__img" />
    <div
      class="notification-bar__content"
      v-html="DOMPurify.sanitize(marked.parse(barContent || '') as string, { FORBID_TAGS: ['style'] })"
    />

    <div class="notification-bar__close" @click="deactivateBar">
      <atomic-icon id="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import debounce from 'lodash/debounce.js';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const dayjs = useDayjs();
  const currentTime = ref(dayjs.utc());
  const bar = ref();
  const isShowBar = ref<boolean>(true);
  const hideBarCookie = useCookie('hide-notification-bar', { maxAge: 60 * 60 * 24 * 365 * 10 });

  const releaseDates = computed(() => {
    const showFrom = getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBar.showFrom');
    const showTo = getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBar.showTo');

    return showFrom && showTo ? dayjs(currentTime.value).isBetween(showFrom, dayjs(showTo)) : true;
  });

  const barContentImg = computed(() => getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBar.image'));

  const barContent = computed(() => getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBar.content'));

  const displayBar = computed(() => {
    return (
      !hideBarCookie.value &&
      isShowBar.value &&
      getContent(layoutData, defaultLocaleLayoutData, 'header.notificationBar.display') &&
      barContent.value &&
      releaseDates.value
    );
  });

  const updateCssVars = () => {
    const header = document.querySelector('.app-header') as HTMLElement;
    const headerRoot = document.querySelector('.app-header-root') as HTMLElement;

    nextTick(() => {
      document.body.style.cssText = `
        --header-height: ${header.offsetHeight}px;
        --header-total-height: ${headerRoot.offsetHeight}px;
        --bar-height: ${headerRoot.offsetHeight - header.offsetHeight}px
      `;
    });
  };

  const onResize = debounce(() => {
    updateCssVars();
  }, 400);

  const deactivateBar = () => {
    bar.value?.offsetParent?.classList.add('is-notification-bar-hide');
    isShowBar.value = false;
    updateCssVars();
    hideBarCookie.value = 'true';
  };

  onMounted(() => {
    window.addEventListener('resize', onResize);
    onResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });

  defineExpose({
    updateCssVars,
  });
</script>

<style src="~/assets/styles/components/atomic/notification-bar.scss" lang="scss" />
