<template>
  <div class="bonus-page">
    <div class="header" :data-bg="pageContent?.backgroundColor || 'gray'">
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
      <atomic-text-editor class="description" :content="pageContent?.description || ''" />

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
  import { BonusPageInterface } from '~/types';

  const pageContent = ref<BonusPageInterface|undefined>(undefined);
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const route = useRoute();
  const { pageUrl } = route.params;
  const contentRequest = await useAsyncData('pageContent', () => queryContent(`bonus/${currentLocale.value.code}-${pageUrl}`).findOne(), { initialCache: false });
  if (contentRequest.error.value) throw contentRequest.error.value;
  else pageContent.value = contentRequest.data.value as BonusPageInterface;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(pageContent.value?.seo);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openDepositModal, showModal } = useLayoutStore();

  const router = useRouter();
  const { localizePath } = useProjectMethods();
  const clickButton = (url: string|undefined):void => {
    if (url) router.push(localizePath(url));
    else isLoggedIn.value ? openDepositModal() : showModal('register');
  };
</script>

<style lang="scss" src="./style.scss"/>
