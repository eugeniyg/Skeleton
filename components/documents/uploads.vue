<template>
  <div class="documents-uploads">
    <div class="documents-uploads__head">
      <button-base type="ghost-gray" size="sm" @click="emit('prevStep')">
        <atomic-icon id="arrow-previous" />
      </button-base>

      <div class="documents-uploads__title">
        {{ verifyTitle }}
      </div>
    </div>

    <div v-if="instructionContent?.photoInstruction?.length" class="documents-uploads__instructions">
      <documents-instruction
        v-for="(instruction, index) in instructionContent.photoInstruction"
        :key="index"
        :instruction-data="instruction"
      />
    </div>

    <atomic-text-editor
      v-if="instructionContent?.description"
      class="documents-uploads__description"
      :content="instructionContent.description"
    />

    <div v-if="props.documentType" class="documents-uploads__list">
      <documents-dropzone
        v-for="item in formFields[props.documentType]"
        :key="item"
        :file-name="getContent(documentsContent, defaultLocaleDocumentsContent, `uploadDocumentName.${item}`) || item"
        :file-list="props.formData[item]"
        :loading="props.loadingFields.includes(item)"
        @remove="emit('removeFile', { name: item, ...$event })"
        @change="emit('addFiles', { fieldName: item, fileList: $event })"
      />
    </div>

    <div
      v-if="['passport', 'payment'].includes(props.documentType || '') && alertText"
      class="documents-uploads__alert"
    >
      <div class="documents-uploads__alert-icon">
        <atomic-icon id="info" />
      </div>

      <div class="documents-uploads__alert-text">{{ alertText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    documentType?: string;
    formData: IFormData;
    loadingFields: string[];
  }>();

  const formFields: Record<string, string[]> = {
    passport: ['identity_front', 'identity_back'],
    identity_selfie_id: ['identity_selfie_id'],
    address: ['address'],
    payment: ['payment', 'payment_back'],
    other: ['other'],
  };
  const emit = defineEmits(['prevStep', 'removeFile', 'addFiles']);

  const documentsContent = ref<Maybe<IProfileDocuments>>(inject('documentsContent'));
  const defaultLocaleDocumentsContent = ref<Maybe<IProfileDocuments>>(inject('defaultLocaleDocumentsContent'));
  const titleTemplate = computed(() =>
    getContent(documentsContent.value, defaultLocaleDocumentsContent.value, 'verificationTitle')
  );
  const typeContent = computed(() =>
    getContent(documentsContent.value, defaultLocaleDocumentsContent.value, `documentTypeCards.${props.documentType}`)
  );
  const instructionContent = computed(() =>
    getContent(documentsContent.value, defaultLocaleDocumentsContent.value, `verification.${props.documentType}`)
  );

  const verifyTitle = computed(() => {
    if (titleTemplate.value) {
      return titleTemplate.value.replace('{type}', typeContent.value?.title || props.documentType);
    }
    return '';
  });

  const alertText = computed(() =>
    getContent(documentsContent.value, defaultLocaleDocumentsContent.value, `verification.${props.documentType}.alert`)
  );
</script>

<style src="~/assets/styles/components/documents/uploads.scss" lang="scss" />
