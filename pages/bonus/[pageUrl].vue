<template>
  <div class="bonus-page">
    <div class="header" :data-bg="pageContent?.backgroundColor">
      <img
        v-if="pageContent?.image"
        class="img"
        :src="pageContent.image"
        alt=""
      />
    </div>

    <div class="content">
      <h1 class="title">{{ pageContent?.title }}</h1>
      <h3 class="sub-title">{{ pageContent?.subtitle }}</h3>
      <atomic-text-editor
        class="description"
        :content="pageContent?.description || ''"
      />

      <button-base
        type="primary"
        size="lg"
        @click="clickButton(pageContent?.button?.url)"
      >
        {{ pageContent?.button?.label }}
      </button-base>

      <atomic-detail
        v-if="pageContent?.termsLabel && pageContent?.termsContent"
        :title="pageContent.termsLabel"
        :content="pageContent.termsContent"
      />
    </div>

    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IBonusPage } from "~/types";

  const pageContent = ref<IBonusPage|undefined>(undefined);
  const route = useRoute();
  const { pageUrl } = route.params;
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const {
    localizePath,
    setPageSeo
  } = useProjectMethods();

  const { data: { value: bonusPageContent } }: { data: { value: IBonusPage }} = await useAsyncData(`${pageUrl}-content`,
    () => queryContent(currentLocale.value?.code as string, 'bonus', pageUrl as string).findOne());

  if (bonusPageContent) {
    pageContent.value = bonusPageContent;
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }

  setPageSeo(pageContent.value?.seo);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openDepositModal, showModal } = useLayoutStore();

  const router = useRouter();
  const clickButton = (url: string|undefined):void => {
    if (url) router.push(localizePath(url));
    else isLoggedIn.value ? openDepositModal() : showModal('register');
  };
</script>

<style src="~/assets/styles/pages/bonus/index.scss" lang="scss" />

