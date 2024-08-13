<template>
  <div
    :class="dropzoneClasses"
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <atomic-icon class="dropzone__icon" :id="!fileList?.length ? 'upload': 'file'" />

    <div class="dropzone__content">
      <h4 class="dropzone__title">{{ props.fileName }}</h4>

      <div class="dropzone__files">
        <atomic-file
          v-for="file in props.fileList"
          v-bind="file"
          :key="file.id"
          :error="file.error"
          @remove="emit('remove', { id: file.id, status: file.status } )"
        />
      </div>

      <form-input-file
        v-if="documentsContent || defaultLocaleDocumentsContent"
        :placeholder="getContent(documentsContent, defaultLocaleDocumentsContent, 'uploadPlaceholder')"
        :hint="getContent(documentsContent, defaultLocaleDocumentsContent, 'uploadHint')"
        :uploadButton="getContent(documentsContent, defaultLocaleDocumentsContent, 'uploadButton')"
        :uploadMore="getContent(documentsContent, defaultLocaleDocumentsContent, 'uploadMore')"
        :showMoreButton="!!props.fileList?.length"
        :loading="props.loading"
        @change="addFiles"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
  import type { IDocumentFile } from '@skeleton/core/types';
  import type { IProfileDocuments } from '~/types';

  const props = defineProps<{
    fileName?: string,
    loading: boolean,
    fileList: IDocumentFile[]
  }>();

  const emit = defineEmits(['remove', 'change']);

  const { getContent } = useProjectMethods();
  const isActive = ref(false);
  const documentsContent = ref<Maybe<IProfileDocuments>>(inject('documentsContent'));
  const defaultLocaleDocumentsContent = ref<Maybe<IProfileDocuments>>(inject('defaultLocaleDocumentsContent'));
  const errorFiles = computed(() => props.fileList.filter((file) => file.error));

  const dropzoneClasses = computed(() => ({
    dropzone: true,
    'is-active': isActive.value,
    'is-error': errorFiles.value.length,
    'has-docs': props.fileList.length
  }));

  const toggleActive = () => {
    isActive.value = !isActive.value;
  };

  const addFiles = (fileList: File[]):void => {
    isActive.value = false;
    emit('change', fileList);
  };

  const onDrop = (e:any) => {
    const { files } = e.dataTransfer;
    addFiles(files);
  };
</script>

<style src="~/assets/styles/components/documents/dropzone.scss" lang="scss" />

