<template>
  <div
    :class="dropzoneClasses"
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <atomic-icon class="dropzone__icon" :id="!isFileLoaded ? 'ui-upload': 'ui-file'"/>

    <div class="dropzone__content">
      <h4 class="dropzone__title">{{ props.title }}</h4>

      <div class="dropzone__files">
        <atomic-file
          v-for="file in filesList"
          :title="file.name"
          :key="file"
          @rm-file="removeFile(file.name)"
          @file-has-error="highlightBorderOn"
          @file-error-off="highlightBorderOff"
        />
      </div>

      <form-input-file
        @change="changeAction"
        :value="inputValue"
        :sub-title="props.subTitle"
        :desc="props.desc"
        :show-more-btn="isShowMoreBtn"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
  const isFileLoaded = ref(false);
  const isActive = ref(false);
  const isError = ref(false);
  const inputValue = ref('');
  const filesList = ref([]);
  const isShowMoreBtn = ref(false);

  const props = defineProps<{
    title: string,
    subTitle: string,
    desc: string,
    hint: string,
  }>();

  const dropzoneClasses = computed(() => ({
    dropzone: true,
    'is-active': isActive.value,
    'is-error': isError.value,
  }));

  const toggleActive = () => {
    isActive.value = !isActive.value;
  };

  const changeDropZoneIcon = () => {
    isFileLoaded.value = true;
  };

  const addFiles = (files) => {
    filesList.value.push(...files);
    isActive.value = false;
    isShowMoreBtn.value = true;

    if (!isFileLoaded.value) {
      changeDropZoneIcon();
    }
  };

  const onDrop = (e) => {
    const { files } = e.dataTransfer;
    addFiles(files);
  };

  const changeAction = (files) => addFiles(files);

  const removeFile = (name) => {
    filesList.value = filesList.value.filter((file) => file.name !== name);

    if (filesList.value.length === 0) {
      isShowMoreBtn.value = false;
      isFileLoaded.value = false;
    }
  };

  const highlightBorderOn = () => {
    isError.value = true;
  };

  const highlightBorderOff = () => {
    isError.value = false;
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
