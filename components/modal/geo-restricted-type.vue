<template>
  <vue-final-modal
    class="modal-geo-restricted-type"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="modal-geo-restricted-type__content">
      <div class="modal-geo-restricted-type__header">
        <button-modal-close @close="closeModal('geo-restricted-type')" />
      </div>

      <atomic-image
        class="modal-geo-restricted-type__image"
        :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')"
      />

      <div class="modal-geo-restricted-type__title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
      </div>

      <div
        class="modal-geo-restricted-type__description"
        v-html="DOMPurify.sanitize(marked.parseInline(description || '') as string, { FORBID_TAGS: ['style'] })"
      />

      <atomic-geo-info />

      <button-base
        size="md"
        type="primary"
        class="modal-geo-restricted-type__btn"
        @click="closeModal('geo-restricted-type')"
      >
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'buttonLabel') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';
  import DOMPurify from 'isomorphic-dompurify';
  import { marked } from 'marked';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['geoRestrictedType']>;
    defaultLocaleData: Maybe<IModalsContent['geoRestrictedType']>;
  }>();

  const { closeModal } = useModalStore();
  const { getContent } = useProjectMethods();

  const description = getContent(props.currentLocaleData, props.defaultLocaleData, 'description');
</script>

<style src="~/assets/styles/components/modal/geo-restricted-type.scss" lang="scss" />
