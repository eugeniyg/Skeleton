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
        :placeholder="documentsContent?.uploadPlaceholder"
        :hint="documentsContent?.uploadHint"
        :uploadButton="documentsContent?.uploadButton"
        :uploadMore="documentsContent?.uploadMore"
        :showMoreButton="!!props.fileList?.length"
        :loading="props.loading"
        @change="addFiles"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
  import { SecurityFileInterface } from '@platform/frontend-core/dist/module';
  import { ProfileDocumentsInterface } from '~/types';

  const props = defineProps<{
    fileName: string,
    loading: boolean,
    fileList: SecurityFileInterface[]
  }>();

  const emit = defineEmits(['remove', 'change']);

  const isActive = ref(false);
  const documentsContent:ProfileDocumentsInterface = inject('documentsContent');
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

  const onDrop = (e) => {
    const { files } = e.dataTransfer;
    addFiles(files);
  };
</script>

<style lang="scss">
.dropzone {
  padding: var(--dropzone-padding, #{rem(16px)} #{rem(24px)});
  min-height: rem(154px);
  border: 1px dashed var(--gray-700);
  border-radius: 8px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "icon content";
  grid-column-gap: rem(16px);
  background-color: var(--dropzone-bg, transparent);
  transition: background-color .4s ease-in-out;
  align-content: center;

  @include media(sm) {
    grid-template-areas: "icon" "content";
    grid-template-columns: 1fr;
    --dropzone-padding: #{rem(16px)} #{rem(16px)} #{rem(24px)}
  }

  &.is-active {
    --dropzone-bg: var(--gray-700);
  }

  &.is-error {
    border-color: var(--red-700);
  }

  .hint {
    @include upd-font($body-0);
    justify-content: center;
    text-align: center;
    color: var(--red-300);
  }

  &__content {
    grid-area: content;
  }

  &__icon {
    color: var(--gray-400);
    grid-area: icon;
    align-self: center;
    --icon-size: 24px;

    @include media(sm) {
      margin: 0 auto;
    }
  }

  &__files {
    display: grid;
    grid-row-gap: rem(12px);
  }

  &__title {
    @include font($heading-1);
    margin: 0 0 rem(4px);
    padding: 0;
    color: var(--white);

    @include media(sm) {
      text-align: center;
    }
  }

  .btn-select-file {
    margin-top: rem(8px);
    --width: 100%;

    @include media(sm) {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      --width: fit-content;
    }
  }
}

</style>
