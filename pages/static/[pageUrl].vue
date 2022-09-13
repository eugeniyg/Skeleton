<template>
  <atomic-text-editor :content="pageContent" />
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const pageContent = ref<string|undefined>('');
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const route = useRoute();
  const { pageUrl } = route.params;
  const contentRequest = await useAsyncData('pageContent', () => queryContent(`static/${currentLocale.value.code}-${pageUrl}`).findOne(), { initialCache: false });
  if (contentRequest.error.value) throw contentRequest.error.value;
  else pageContent.value = contentRequest.data.value.content;
</script>
