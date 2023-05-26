<template>
  <footer class="app-footer">
    <div class="group">
      <accordeon
        v-for="(menu, index) in accordeonItems"
        :key="index"
        :heading="menu?.title"
        :items="menu?.items"
        :isOpen="true"
        mode="toggle"
      >
        <template v-slot:header="{ heading }">
          <h4>{{ heading }}</h4>
        </template>

        <template v-slot:content="{ item }">
          <nuxt-link :to="localizePath(item.url)">{{ item.label }}</nuxt-link>
        </template>
      </accordeon>

      <list-base :items="trustIcons">
        <template #header>
          <h4>{{ footerContent?.responsibilityLabel || defaultLocaleFooterContent?.responsibilityLabel }}</h4>
        </template>

        <template v-slot:item="{ item }">
          <img :src="`/img${item}`" />
        </template>
      </list-base>
    </div>

    <atomic-divider/>

    <list-paysis :items="paymentItems"/>

    <atomic-divider/>

    <div v-if="footerContent?.curacao || defaultLocaleFooterContent?.curacao" class="info">
      <iframe
        src="https://licensing.gaming-curacao.com/validator/?lh=95426453d291d7c01ec3a7e5aaf8b499&template=tseal"
        width="132px"
        height="62px"
      />

      <div class="info__text" v-html="marked.parse(footerContent?.curacao || defaultLocaleFooterContent?.curacao || '')" />
    </div>

    <atomic-divider/>

    <div class="copy-info">
      <p>{{ footerContent?.copyright || defaultLocaleFooterContent?.copyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { localizePath } = useProjectMethods();

  const { footerContent, defaultLocaleFooterContent } = useGlobalStore();
  const accordeonItems = [
    footerContent?.promoMenu || defaultLocaleFooterContent?.promoMenu,
    footerContent?.infoMenu || defaultLocaleFooterContent?.infoMenu,
    footerContent?.helpMenu || defaultLocaleFooterContent?.helpMenu,
  ];
  const trustIcons = [
    '/trust-icons/1.svg',
    '/trust-icons/2.svg',
    '/trust-icons/3.svg',
    '/trust-icons/4.svg',
  ];

  const paymentItems = [
    '/payments-icons/1.svg',
    '/payments-icons/2.svg',
    '/payments-icons/3.svg',
    '/payments-icons/4.svg',
  ];
</script>

<style lang="scss">
.app-footer {
  grid-area: app-footer;
  color: var(--gray-500);
  display: grid;
  padding: var(--padding, #{rem(16px)} #{rem(16px)} #{rem(110px)} #{rem(16px)});
  @extend %container;

  .heading-primary {
    @include font($heading-4);
  }

  .heading-secondary {
    @include font($heading-2);
  }

  p {
    @include font($body-1-paragraph);
    margin: 0;
  }

  .info {
    display: flex;
    flex-direction: column;

    iframe {
      margin: var(--img-margin, 0 auto 24px);
      background-color: var(--gray-600);
      border-radius: 8px;
      border: rem(8px) solid var(--gray-600);
      box-sizing: content-box;
      width: calc(106px + 16px);
      height: calc(34px + 16px);
    }

    &__text {
      a {
        color: var(--gray-500);
        text-decoration: underline;
      }
    }

    @include media(l) {
      flex-direction: row;
      grid-column-gap: rem(16px);
      align-items: center;
      --img-margin: 0;
    }

  }

  .copy-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      margin-bottom: var(--margin-bottom, 16px)
    }

    @include media(l) {
      flex-direction: row;
      grid-column-gap: rem(16px);
      align-items: center;
      justify-content: center;
      --margin-bottom: 0;
    }

  }

  .header {
    @include media(xs) {
      --padding: 0 0 #{rem(16px)} 0
    }
  }

  .group {
    display: grid;
    grid-gap: rem(8px);
    margin-top: rem(40px);
    align-items: flex-start;

    @include media(xs) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: rem(24px);

      .btn-toggle {
        visibility: hidden;
      }

      .items {
        grid-template-columns: repeat(2, auto);
        --display: grid;
      }
    }

    @include media(sm) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @include media(sm) {
    --padding: #{rem(16px)} #{rem(32px)} #{rem(110px)} #{rem(32px)}
  }
}
</style>
