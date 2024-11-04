<template>
  <vue-final-modal
    v-model="modals.depositRedirect"
    class="modal-success-deposit"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
    @clickOutside="closeModal('depositRedirect')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('depositRedirect')"/>
        <client-only>
          <div class="title">{{ label }}</div>
        </client-only>
      </div>
      
      <atomic-image
        class="img"
        :src="image"
        width="104"
        height="104"
      />
      
      <client-only>
        <p
          class="text"
          v-html="DOMPurify.sanitize(marked.parse(description || '') as string, { FORBID_TAGS: ['style'] })"
        />
      </client-only>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import DOMPurify from "isomorphic-dompurify";

  const layoutStore = useLayoutStore();
  const {
    modals,
  } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();
  
  const label = computed(() => {
    return getContent(popupsData, defaultLocalePopupsData, 'depositRedirect.label');
  });
  
  const image = computed(() => {
    return getContent(popupsData, defaultLocalePopupsData, 'depositRedirect.image');
  });
  
  const description = computed(() => {
    return getContent(popupsData, defaultLocalePopupsData, 'depositRedirect.description');
  });
  
</script>

<style src="~/assets/styles/components/modal/success.scss" lang="scss"/>

