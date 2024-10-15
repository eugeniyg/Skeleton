<template>
  <div class="static-page">
    <template v-if="currentLocaleData || defaultLocaleData">
      <atomic-text-editor :content="currentLocaleData?.content || defaultLocaleData?.content" />
      <atomic-seo-text v-if="currentLocaleData?.pageMeta?.seoText" v-bind="currentLocaleData?.pageMeta?.seoText" />
    </template>

    <not-found v-else-if="status !== 'pending'" />
  </div>
</template>

<script setup lang="ts">
  import type { IStaticPage } from '~/types';

  const route = useRoute();
  const { pageIdentity } = route.params;
  const { getPageContent } = useNewContentLogic<IStaticPage>({
    contentKey: `${pageIdentity}-static-content`,
    contentRoute: ['static'],
    isPage: true,
    where: { pageIdentity }
  });

  const { error, status, data } = await useLazyAsyncData(`${pageIdentity}-static-content`, () => getPageContent());
  console.log(data);



  // const { currentLocaleContent, defaultLocaleContent, status } = useNewContentLogic<IStaticPage>({
  //   contentKey: `${pageIdentity}-static-content`,
  //   contentRoute: ['static'],
  //   isPage: true,
  //   where: { pageIdentity }
  // });
</script>
