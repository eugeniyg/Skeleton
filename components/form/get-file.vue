<template>
  <form class="get-file" :class="props.type">
    <div
      :class="['get-file__description', {'is-expanded': isTextExpanded}]"
      v-html="marked.parse(getContent(documentsContent, defaultLocaleDocumentsContent, `${props.type}.description`))"
    />
    
    <button
      class="show-more-btn"
      @click.prevent="clickAction"
    >
      <span>{{ isTextExpanded ? getContent(documentsContent, defaultLocaleDocumentsContent, 'hideText')
        : getContent(documentsContent, defaultLocaleDocumentsContent, 'moreInfo') }}</span>
      <atomic-icon id="arrow_expand-close"/>
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
  import type { IVerificationFile } from '@skeleton/core/types';
  import type { IProfileVerification } from '~/types';
  import { marked } from 'marked';

  const props = defineProps<{
    type: 'identity'|'address'|'payment',
    loadingFields: string[],
    formData: {
      identity_front?: IVerificationFile[],
      identity_back?: IVerificationFile[],
      identity_selfie_id?: IVerificationFile[],
      address?: IVerificationFile[],
      payment?: IVerificationFile[],
    },
  }>();

  const emit = defineEmits(['removeFile', 'addFiles']);
  
  const isTextExpanded = ref<boolean>(false);
  const documentsContent: Maybe<IProfileVerification['documents']> = inject('documentsContent');
  const defaultLocaleDocumentsContent: Maybe<IProfileVerification['documents']> = inject('defaultLocaleDocumentsContent');
  const { getContent } = useProjectMethods();
  
  const clickAction = () => {
    isTextExpanded.value = !isTextExpanded.value;
  };
</script>

<style src="~/assets/styles/components/form/get-file.scss" lang="scss" />

