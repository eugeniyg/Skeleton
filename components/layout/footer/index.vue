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
          <h4>{{ footerContent?.responsibilityLabel }}</h4>
        </template>

        <template v-slot:item="{ item }">
          <img :src="`/img${item}`" />
        </template>
      </list-base>
    </div>

    <atomic-divider/>

    <list-paysis :items="paymentItems"/>

    <atomic-divider/>

    <div v-if="footerContent?.curacao?.url" class="info">
      <a class="info__link" :href="footerContent.curacao.url" target="_blank">
        <img :src="footerContent.curacao.image" />
      </a>

      <div class="info__text" v-html="marked.parse(footerContent.curacao.text || '')" />
    </div>

    <atomic-divider/>

    <div class="copy-info">
      <p>{{ footerContent?.copyright }}</p>
      <!--      <img src="~/assets/img/copy-logo.svg" width="150" height="22" />-->
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { localizePath } = useProjectMethods();

  const { footerContent } = useGlobalStore();
  const accordeonItems = [footerContent?.promoMenu, footerContent?.infoMenu, footerContent?.helpMenu];
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

<style lang="scss" src="./style.scss"/>
