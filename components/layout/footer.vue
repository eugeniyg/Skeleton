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
          <h4>{{ layoutData?.footer?.responsibilityLabel || defaultLocaleLayoutData?.footer?.responsibilityLabel }}</h4>
        </template>

        <template v-slot:item="{ item }">
          <atomic-image :src="`/img${item}`" />
        </template>
      </list-base>
    </div>

    <atomic-divider/>

    <list-paysis
      v-if="layoutData?.footer?.paymentsList"
      :currentLocaleContent="layoutData?.footer?.paymentsList"
      :defaultLocaleContent="defaultLocaleLayoutData?.footer?.paymentsList"
    />

    <atomic-divider/>
    
    <template v-if="showCuracaoBlock">
      <div class="info">
        <iframe
          v-if="layoutData?.footer?.curacao?.frameLink || defaultLocaleLayoutData?.footer?.curacao?.frameLink"
          :src="layoutData?.footer?.curacao?.frameLink || defaultLocaleLayoutData?.footer?.curacao?.frameLink"
          width="132px"
          height="62px"
          data-not-lazy
        />

        <div
          v-if="layoutData?.footer?.curacao?.description || defaultLocaleLayoutData?.footer?.curacao?.description"
          class="info__text"
          v-html="marked.parse(layoutData?.footer?.curacao?.description || defaultLocaleLayoutData?.footer?.curacao?.description || '')"
        />
      </div>

      <atomic-divider/>
    </template>

    <div class="copy-info">
      <p>{{ layoutData?.footer?.copyright || defaultLocaleLayoutData?.footer?.copyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { localizePath, getContent } = useProjectMethods();

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const accordeonItems = [
    layoutData?.footer?.promoMenu || defaultLocaleLayoutData?.footer?.promoMenu,
    layoutData?.footer?.infoMenu || defaultLocaleLayoutData?.footer?.infoMenu,
    layoutData?.footer?.helpMenu || defaultLocaleLayoutData?.footer?.helpMenu,
  ];
  const trustIcons = [
    '/trust-icons/1.svg',
    '/trust-icons/2.svg',
    '/trust-icons/3.svg',
    '/trust-icons/4.svg',
  ];
  
  const showCuracaoBlock = computed(() => {
    return layoutData?.footer?.curacao?.description ||
      defaultLocaleLayoutData?.footer?.curacao?.description ||
      layoutData?.footer?.curacao?.frameLink ||
      defaultLocaleLayoutData?.footer?.curacao?.frameLink
  })
  
</script>

<style src="~/assets/styles/components/layout/footer.scss" lang="scss" />
