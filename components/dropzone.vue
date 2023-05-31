<template>
  <div
    :class="dropzoneClasses"
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <atomic-icon class="dropzone__icon" :id="!fileList?.length ? 'ui-upload': 'ui-file'"/>

    <div class="dropzone__content">
      <h4 class="dropzone__title">{{ props.fileName }}</h4>

      <div class="dropzone__files">
        <atomic-file
          v-for="file in props.fileList"
          v-bind="file"
          :key="file.id"
          :error="file.error"
          @remove="emit('remove', file.id)"
        />
      </div>

      <form-input-file
        :placeholder="documentsContent?.uploadPlaceholder || defaultLocaleDocumentsContent?.uploadPlaceholder"
        :hint="documentsContent?.uploadHint || defaultLocaleDocumentsContent?.uploadHint"
        :uploadButton="documentsContent?.uploadButton || defaultLocaleDocumentsContent?.uploadButton"
        :uploadMore="documentsContent?.uploadMore || defaultLocaleDocumentsContent?.uploadMore"
        :showMoreButton="!!props.fileList?.length"
        :loading="props.loading"
        @change="addFiles"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
  import { SecurityFileInterface } from '@platform/frontend-core/dist/module';
  import { ProfileDocumentsInterface } from '@skeleton/types';

  const props = defineProps<{
    fileName?: string,
    loading: boolean,
    fileList: SecurityFileInterface[]
  }>();

  const emit = defineEmits(['remove', 'change']);

  const isActive = ref(false);
  const documentsContent: Maybe<ProfileDocumentsInterface> = inject('documentsContent');
  const defaultLocaleDocumentsContent: Maybe<ProfileDocumentsInterface> = inject('defaultLocaleDocumentsContent');
  const errorFiles = computed(() => props.fileList.filter((file) => file.error));

  const dropzoneClasses = computed(() => ({
    dropzone: true,
    'is-active': isActive.value,
    'is-error': errorFiles.value.length,
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

<style src="~/assets/styles/components/dropzone.scss" lang="scss" />

