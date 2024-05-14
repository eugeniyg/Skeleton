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

        <template v-slot:content="{ item }: { item: ILink }">
          <atomic-link :href="item.url" :targetBlank="item?.targetBlank">
            {{ item.label }}
          </atomic-link>
        </template>
      </accordeon>

      <partners
        v-if="layoutData?.footer?.partners?.isShow"
        :label="layoutData?.footer?.partners?.label || defaultLocaleLayoutData?.footer?.partners?.label"
        :items="layoutData?.footer?.partners?.items || defaultLocaleLayoutData?.footer?.partners?.items"
      />

      <list-base :items="layoutData?.footer?.responsibilityIcons || defaultLocaleLayoutData?.footer?.responsibilityIcons">
        <template #header>
          <h4>{{ layoutData?.footer?.responsibilityLabel || defaultLocaleLayoutData?.footer?.responsibilityLabel }}</h4>
        </template>

        <template v-slot:item="{ item }">
          <atomic-image :src="`${item.image}`"/>
        </template>
      </list-base>
    </div>

    <atomic-divider/>

    <client-only>
      <list-paysis />
    </client-only>

    <atomic-divider/>
    
    <template v-if="layoutData?.footer?.custom?.show || defaultLocaleLayoutData?.footer?.custom?.show">
      <div class="info">
        <atomic-image
            v-if="layoutData?.footer?.custom?.image || defaultLocaleLayoutData?.footer?.custom?.image"
            :src="layoutData?.footer?.custom?.image || defaultLocaleLayoutData?.footer?.custom?.image"
            width="132px"
            height="62px"
            data-not-lazy
        />
        
        <div
            v-if="layoutData?.footer?.custom?.description || defaultLocaleLayoutData?.footer?.custom?.description"
            class="info__text"
            v-html="marked.parse(layoutData?.footer?.custom?.description || defaultLocaleLayoutData?.footer?.custom?.description || '')"
        />
      </div>
      
      <atomic-divider/>
    </template>
    
    <template v-if="layoutData?.footer?.curacao?.show || defaultLocaleLayoutData?.footer?.curacao?.show">
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
  import type { ILink } from "~/types";

  const { localizePath } = useProjectMethods();

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const accordeonItems = [
      layoutData?.footer?.promoMenu || defaultLocaleLayoutData?.footer?.promoMenu,
      layoutData?.footer?.infoMenu || defaultLocaleLayoutData?.footer?.infoMenu,
      layoutData?.footer?.helpMenu || defaultLocaleLayoutData?.footer?.helpMenu,
    ].filter(menu => menu?.title && menu?.items?.length);
  
  const showCuracaoBlock = computed(() => {
    return layoutData?.footer?.curacao?.description ||
      defaultLocaleLayoutData?.footer?.curacao?.description ||
      layoutData?.footer?.curacao?.frameLink ||
      defaultLocaleLayoutData?.footer?.curacao?.frameLink;
  });

</script>

<style src="~/assets/styles/components/layout/footer.scss" lang="scss"/>
