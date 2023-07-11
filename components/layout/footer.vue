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

<style src="~/assets/styles/components/layout/footer.scss" lang="scss" />
