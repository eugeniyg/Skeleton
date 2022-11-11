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
  const contentRequest = await useAsyncData('pageContent', () => queryContent(`bonus/${currentLocale.value?.code}-${pageUrl}`).findOne(), { initialCache: false });
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

<style lang="scss">
.bonus-page {
  margin-top: rem(-24px);
  > .header {
    background: var(--bg, var(--gray-900));
    height: var(--height, #{rem(200px)});
    padding-top: rem(40px);
    margin: var(--margin, 0 #{rem(-16px)});

    @include media(sm) {
      --margin: 0 #{rem(-32px)}
    }

    &[data-bg="gray"] {
      --bg: var(--gray-900);
    }

    &[data-bg="red"] {
      --bg: linear-gradient(187.95deg, #950428 44.73%, #28263B 93.88%);
    }

    &[data-bg="yellow"] {
      --bg: linear-gradient(187.95deg, #A04800 44.73%, #28263B 93.88%);
    }

    &[data-bg="green"] {
      --bg: linear-gradient(187.95deg, #045518 44.73%, #28263B 93.88%);
    }

    &[data-bg="blue"] {
      --bg: linear-gradient(187.95deg, #320647 44.73%, #28263B 93.88%);
    }

    .img {
      width: var(--width, #{rem(160px)});
      height: auto;
      display: block;
      margin: 0 auto;
    }

    @include media(xs) {
      --height: #{rem(280px)};

      .img {
        --width: #{rem(240px)};
      }
    }
  }

  .content {
    @extend %text-page-max;
    padding-top: rem(40px);

    > .title {
      @include font($heading-1);
      color: var(--yellow-500);
      margin: 0 0 rem(8px);
      padding: 0;
    }

    > .sub-title {
      @include font($heading-7);
      color: var(--white);
      margin: 0 0 rem(16px);
      padding: 0;
    }

    > .description {
      @include font($body-3-paragraph);
      color: var(--gray-400);
      margin: 0 0 rem(16px);
      padding: 0;
    }

    > .list-title {
      @include font($heading-3);
      color: var(--white);
      margin: 0 0 rem(16px);
      padding: 0;
    }

    > ol {
      margin: 0;
      padding: 0;
      list-style: none;
      @include font($body-3-paragraph);
      color: var(--gray-400);

      li {
        margin: rem(12px) 0;
      }

      > ul {
        margin: 0;
        padding: 0;
        list-style: disc inside;
        @include font($body-3-paragraph);

        li {
          margin: rem(12px) 0;
          padding: 0 0 0 rem(20px);
        }
      }
    }
  }

  .detail {
    margin-top: rem(40px);
  }
}
</style>
