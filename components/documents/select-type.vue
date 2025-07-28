<template>
  <div class="documents-select-type">
    <h2 class="documents-select-type__title">
      {{ getContent(documentsContent, defaultLocaleDocumentsContent, 'selectTypeTitle') }}
    </h2>

    <div class="documents-select-type__list">
      <documents-card-type
        v-for="type in documentTypes"
        :key="type"
        :type="type"
        :type-status="documentTypeStatus[type]"
        :class="{ active: selectedType === type }"
        @click="selectedType = type"
      />
    </div>

    <button-base type="primary" :is-disabled="!selectedType" size="md" @click="emit('nextStep', selectedType)">
      {{ getContent(documentsContent, defaultLocaleDocumentsContent, 'continueButton') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { IProfileDocuments } from '~/types';
  import type { IDocumentFile } from '@skeleton/api/types';

  interface IFormData extends Record<string, IDocumentFile[]> {
    identity_front: IDocumentFile[];
    identity_back: IDocumentFile[];
    identity_selfie_id: IDocumentFile[];
    address: IDocumentFile[];
    payment: IDocumentFile[];
    payment_back: IDocumentFile[];
    other: IDocumentFile[];
  }

  const props = defineProps<{
    formData: IFormData;
  }>();

  const documentTypes = ['passport', 'identity_selfie_id', 'address', 'payment', 'other'];

  const getStatus = (filesArr: IDocumentFile[]): 'pending' | 'approve' | 'canceled' | undefined => {
    if (!filesArr.length) return undefined;
    const hasCanceledFile = filesArr.some(file => file.status === 3);
    const hasPendingFile = filesArr.some(file => file.status === 2);
    if (hasCanceledFile) return 'canceled';
    if (hasPendingFile) return 'pending';
    return 'approve';
  };

  const documentTypeStatus = computed(() => {
    const statuses: Record<string, 'pending' | 'approve' | 'canceled' | undefined> = {};

    documentTypes.forEach(type => {
      if (type === 'passport') {
        if (props.formData.identity_front.length && props.formData.identity_back.length) {
          statuses.passport = getStatus([...props.formData.identity_front, ...props.formData.identity_back]);
        } else if (props.formData.identity_front.length || props.formData.identity_back.length) {
          statuses.passport = 'canceled';
        }
      } else if (type === 'payment') {
        if (props.formData.payment.length && props.formData.payment_back.length) {
          statuses.payment = getStatus([...props.formData.payment, ...props.formData.payment_back]);
        } else statuses.payment = undefined;
      } else {
        statuses[type] = getStatus(props.formData[type]);
      }
    });

    return statuses;
  });

  const documentsContent = ref<Maybe<IProfileDocuments>>(inject('documentsContent'));
  const defaultLocaleDocumentsContent = ref<Maybe<IProfileDocuments>>(inject('defaultLocaleDocumentsContent'));

  const selectedType = ref<(typeof documentTypes)[number] | undefined>();

  const emit = defineEmits(['nextStep']);
</script>

<style src="~/assets/styles/components/documents/select-type.scss" lang="scss" />
