<template>
  <vue-final-modal
    v-model="modals.depositRedirect"
    class="modal-success-deposit"
    :clickToClose="false"
    @clickOutside="closeModal('depositRedirect')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('depositRedirect')"/>
        <client-only>
          <div class="title">{{ title }}</div>
        </client-only>
      </div>
      
      <atomic-image class="img" :src="image" width="104" height="104"/>
      
      <client-only>
        <p class="text" v-html="marked.parse(description || '')"/>
      </client-only>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  
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
  
  const title = computed(() => {
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

