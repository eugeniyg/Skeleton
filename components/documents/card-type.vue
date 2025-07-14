<template>
  <div class="documents-card-type">
    <atomic-svg
      :key="cardContent?.icon"
      :src="cardContent?.icon"
      default-icon="file"
      class="documents-card-type__logo"
    />

    <div class="documents-card-type__content">
      <div class="documents-card-type__title" data-tooltip-parent>
        {{ cardContent?.title }}

        <atomic-tooltip
          v-if="props.typeStatus"
          :text="statusText[props.typeStatus]"
          :icon="statusIcons[props.typeStatus]"
          :class="`status-${props.typeStatus}`"
          :message-custom-class="`status-${props.typeStatus}`"
          size="small"
        />
      </div>

      <div class="documents-card-type__description">
        {{ cardContent?.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileDocuments } from '~/types';
  import { ref } from 'vue';

  const props = defineProps<{
    type: string;
    typeStatus?: 'pending' | 'approve' | 'canceled';
  }>();

  const statusIcons: { [index: string]: string } = {
    approve: 'done',
    pending: 'clock',
    canceled: 'warning',
  };

  const statusText: Record<string, string> = {
    approve: 'Approved',
    pending: 'Pending',
    canceled: 'Rejected',
  };

  const documentsContent = ref<Maybe<IProfileDocuments>>(inject('documentsContent'));
  const defaultLocaleDocumentsContent = ref<Maybe<IProfileDocuments>>(inject('defaultLocaleDocumentsContent'));
  const cardContent = computed(() => {
    return getContent(documentsContent.value, defaultLocaleDocumentsContent.value, `documentTypeCards.${props.type}`);
  });
</script>

<style src="~/assets/styles/components/documents/card-type.scss" lang="scss" />
