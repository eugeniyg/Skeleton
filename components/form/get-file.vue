<template>
  <form class="get-file" :class="props.type">
    <div class="get-file__title">
      {{ getContent(documentsContent, defaultLocaleDocumentsContent, `documents.${props.type}.label`) }}
    </div>

    <div
      ref="excerpt"
      data-exerpt
      :class="['get-file__description', {'is-expanded': isTextExpanded}]"
    >
      {{ getContent(documentsContent, defaultLocaleDocumentsContent, `documents.${props.type}.description`) }}
    </div>

    <button
      v-if="isShowMoreBtn"
      class="show-more-btn"
      @click.prevent="clickAction"
    >
      {{ isTextExpanded ? getContent(documentsContent, defaultLocaleDocumentsContent, 'documents.hideText')
        : getContent(documentsContent, defaultLocaleDocumentsContent, 'documents.moreInfo') }}
    </button>

    <div class="dropzones-list">
      <dropzone
        v-for="item in Object.keys(props.formData)"
        :fileName="getContent(documentsContent, defaultLocaleDocumentsContent, `documents.${props.type}.${item}`)"
        :fileList="props.formData[item]"
        :key="item"
        :loading="props.loadingFields.includes(item)"
        @remove="emit('removeFile', { fieldName: item, fileId: $event })"
        @change="emit('addFiles', { fieldName: item, fileList: $event })"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
  import type { IDocumentFile } from '@skeleton/core/types';
  import type { IProfileDocuments } from '~/types';

  interface IFormData extends Record<string, any> {
    identity_front?: IDocumentFile[];
    identity_back?: IDocumentFile[];
    identity_selfie_id?: IDocumentFile[];
    address?: IDocumentFile[];
    payment?: IDocumentFile[];
  }

  const props = defineProps<{
    type: 'identity'|'address'|'payment',
    loadingFields: string[],
    formData: IFormData,
  }>();

  const emit = defineEmits(['removeFile', 'addFiles']);

  const excerpt = ref<HTMLElement>();
  const isShowMoreBtn = ref<boolean>(false);
  const isTextExpanded = ref<boolean>(false);
  const documentsContent = ref<Maybe<IProfileDocuments>>(inject('documentsContent'));
  const defaultLocaleDocumentsContent = ref<Maybe<IProfileDocuments>>(inject('defaultLocaleDocumentsContent'));
  const { getContent } = useProjectMethods();

  const textHasDots = (el: HTMLElement): boolean => el.scrollHeight > el.offsetHeight;

  const clickAction = () => {
    isTextExpanded.value = !isTextExpanded.value;
  };

  onMounted(() => {
    if (excerpt.value && textHasDots(excerpt.value)) {
      isShowMoreBtn.value = true;
    }
  });
</script>

<style src="~/assets/styles/components/form/get-file.scss" lang="scss" />

