<template>
  <NuxtLayout name="default">
    <Head>
      <Meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, user-scalable=0" />
      <Link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <Link rel="manifest" href="/favicon/site.webmanifest" />
      <Link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
      <Meta name="msapplication-TileColor" content="#da532c" />
      <Meta name="theme-color" content="#ffffff" />
    </Head>

    <div class="not-found">
      <img class="img" src="@/assets/img/404.png" />
      <div class="title">{{ errorContent?.title || pageStaticContent.title }}</div>
      <p class="text">{{ errorContent?.description || pageStaticContent.description }}</p>
      <button-base
        type="primary"
        size="md"
        @click="goHome"
      >
        {{ errorContent?.button.label || pageStaticContent.button.label }}
      </button-base>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ErrorPageInterface } from '~/types';

  const props = defineProps({
    error: Object,
  });

  const pageStaticContent = {
    title: 'Something went wrong',
    description: 'The page you are trying to access does not exist or has been moved. Try going back to our homepage.',
    button: {
      label: 'Homepage',
      url: '/',
    },
  };

  const globalStore = useGlobalStore();
  const { defaultLocale } = storeToRefs(globalStore);
  const route = useRoute();
  const pageLocale = route.params.locale || defaultLocale.value.code;
  const errorContentRequest = await useAsyncData('errorContent', () => queryContent(`page-controls/${pageLocale}`).only(['errorPage']).findOne());
  const errorContent:ErrorPageInterface|undefined = errorContentRequest.data.value?.errorPage;

  const { localizePath } = useProjectMethods();
  const goHome = () => clearError({ redirect: localizePath(errorContent?.button.url || pageStaticContent.button.url) });
  const { preloaderDone } = useProjectMethods();

  onMounted(() => {
    console.error(props.error);
    preloaderDone();
  });
</script>

<style lang="scss">
@import "@/scss/error.scss";
</style>
