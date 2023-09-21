<template>
  <form class="get-file" :class="props.type">
    <div class="get-file__title">
      {{ getContent(documentsContent, defaultLocaleDocumentsContent, `${props.type}.label`) }}
    </div>

    <div
      ref="excerpt"
      data-exerpt
      :class="['get-file__description', {'is-expanded': isTextExpanded}]"
    >
      {{ getContent(documentsContent, defaultLocaleDocumentsContent, `${props.type}.description`) }}
    </div>

    <button
      v-if="isShowMoreBtn"
      class="show-more-btn"
      @click.prevent="clickAction"
    >
      {{ isTextExpanded ? getContent(documentsContent, defaultLocaleDocumentsContent, 'hideText')
        : getContent(documentsContent, defaultLocaleDocumentsContent, 'moreInfo') }}
    </button>

    <div class="dropzones-list">
      <dropzone
        v-for="item in Object.keys(props.formData)"
        :fileName="getContent(documentsContent, defaultLocaleDocumentsContent, `${props.type}.${item}`)"
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
  import { ISecurityFile } from '@skeleton/core/types';
  import { IProfileSecurity } from '~/types';

  const props = defineProps<{
    type: 'identity'|'address'|'payment',
    loadingFields: string[],
    formData: {
      identity_front?: ISecurityFile[],
      identity_back?: ISecurityFile[],
      identity_selfie_id?: ISecurityFile[],
      address?: ISecurityFile[],
      payment?: ISecurityFile[],
    },
  }>();

  const emit = defineEmits(['removeFile', 'addFiles']);

  const excerpt = ref<HTMLElement>();
  const isShowMoreBtn = ref<boolean>(false);
  const isTextExpanded = ref<boolean>(false);
  const documentsContent: Maybe<IProfileSecurity['documents']> = inject('documentsContent');
  const defaultLocaleDocumentsContent: Maybe<IProfileSecurity['documents']> = inject('defaultLocaleDocumentsContent');
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

