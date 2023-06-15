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
  import { SecurityFileInterface } from '@platform/frontend-core/dist/module';
  import { ProfileDocumentsInterface } from '@skeleton/types';

  const props = defineProps<{
    type: 'identity'|'address'|'payment',
    loadingFields: string[],
    formData: {
      identity_front?: SecurityFileInterface[],
      identity_back?: SecurityFileInterface[],
      identity_selfie_id?: SecurityFileInterface[],
      address?: SecurityFileInterface[],
      payment?: SecurityFileInterface[],
    },
  }>();

  const emit = defineEmits(['removeFile', 'addFiles']);

  const excerpt = ref<HTMLElement>();
  const isShowMoreBtn = ref<boolean>(false);
  const isTextExpanded = ref<boolean>(false);
  const documentsContent: Maybe<ProfileDocumentsInterface> = inject('documentsContent');
  const defaultLocaleDocumentsContent: Maybe<ProfileDocumentsInterface> = inject('defaultLocaleDocumentsContent');
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

