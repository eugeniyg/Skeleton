<template>
  <footer class="app-footer">
    <div class="group">
      <accordeon
        v-for="(menu, index) in accordeonItems"
        :key="index"
        :heading="menu?.title"
        :items="menu?.items"
        :is-open="true"
        mode="toggle"
      >
        <template #header="{ heading }">
          <h4>{{ heading }}</h4>
        </template>

        <template #content="{ item }: { item: ILink }">
          <atomic-link :href="item.url" :target-blank="item?.targetBlank">
            {{ item.label }}
          </atomic-link>
        </template>
      </accordeon>

      <partners
        v-if="layoutData?.footer?.partners?.isShow"
        :label="layoutData?.footer?.partners?.label || defaultLocaleLayoutData?.footer?.partners?.label"
        :items="layoutData?.footer?.partners?.items || defaultLocaleLayoutData?.footer?.partners?.items"
      />

      <list-base
        :items="layoutData?.footer?.responsibilityIcons || defaultLocaleLayoutData?.footer?.responsibilityIcons"
      >
        <template #header>
          <h4>{{ layoutData?.footer?.responsibilityLabel || defaultLocaleLayoutData?.footer?.responsibilityLabel }}</h4>
        </template>

        <template #item="{ item }">
          <atomic-image :src="`${item.image}`" />
        </template>
      </list-base>
    </div>

    <atomic-divider />

    <client-only>
      <list-paysis />
    </client-only>

    <atomic-divider />

    <template v-if="layoutData?.footer?.custom?.show || defaultLocaleLayoutData?.footer?.custom?.show">
      <div class="info">
        <atomic-link
          v-if="customLicenseImage && customLicenseLink"
          class="info__image-link"
          :href="customLicenseLink"
          target-blank
        >
          <atomic-image :src="customLicenseImage" data-not-lazy />
        </atomic-link>

        <div v-else-if="customLicenseImage" class="info__image">
          <atomic-image :src="customLicenseImage" data-not-lazy />
        </div>

        <div
          v-if="layoutData?.footer?.custom?.description || defaultLocaleLayoutData?.footer?.custom?.description"
          v-router-links
          class="info__text"
          v-html="customLicenceDescription"
        />
      </div>

      <atomic-divider />
    </template>

    <template v-else-if="layoutData?.footer?.curacao?.show || defaultLocaleLayoutData?.footer?.curacao?.show">
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
          v-html="licenceDescription"
        />
      </div>

      <atomic-divider />
    </template>

    <div class="copy-info">
      <p>{{ layoutData?.footer?.copyright || defaultLocaleLayoutData?.footer?.copyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ILink } from '~/types';
  import DOMPurify from 'isomorphic-dompurify';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const accordeonItems = [
    layoutData?.footer?.promoMenu || defaultLocaleLayoutData?.footer?.promoMenu,
    layoutData?.footer?.infoMenu || defaultLocaleLayoutData?.footer?.infoMenu,
    layoutData?.footer?.newsMenu || defaultLocaleLayoutData?.footer?.newsMenu,
    layoutData?.footer?.helpMenu || defaultLocaleLayoutData?.footer?.helpMenu,
  ].filter(menu => menu?.title && menu?.items?.length);

  const customLicenseImage = computed(
    () => layoutData?.footer?.custom?.image || defaultLocaleLayoutData?.footer?.custom?.image
  );
  const customLicenseLink = computed(
    () => layoutData?.footer?.custom?.link || defaultLocaleLayoutData?.footer?.custom?.link
  );

  const licenceDescription = computed(() => {
    const descriptionContent =
      layoutData?.footer?.curacao?.description || defaultLocaleLayoutData?.footer?.curacao?.description;
    if (!descriptionContent) return '';
    return DOMPurify.sanitize(marked.parse(descriptionContent) as string, { FORBID_TAGS: ['style'] });
  });

  const customLicenceDescription = computed(() => {
    const descriptionContent =
      layoutData?.footer?.custom?.description || defaultLocaleLayoutData?.footer?.custom?.description;
    if (!descriptionContent) return '';
    return DOMPurify.sanitize(marked.parse(descriptionContent) as string, { FORBID_TAGS: ['style'] });
  });
</script>

<style src="~/assets/styles/components/layout/footer.scss" lang="scss" />
