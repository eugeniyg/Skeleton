<template>
  <vue-final-modal
      v-model="modals.oneClick"
      class="modal-one-click"
      :clickToClose="false"
      @clickOutside="closeModal('oneClick')"
      :overlayTransition="{ mode: 'in-out', duration: 200 }"
      :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('oneClick')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'oneClick.title') || '' }}</div>
      </div>
      
      <div class="modal-one-click__fields">
        <form-input-copy-one-click
            name="loginField"
            :label="getContent(popupsData, defaultLocalePopupsData, 'oneClick.loginLabel') || ''"
            :value="loginValue"
        />
        <form-input-copy-one-click
            name="passwordField"
            :label="getContent(popupsData, defaultLocalePopupsData, 'oneClick.passwordLabel') || ''"
            :value="passwordValue"
        />
      </div>
      
      <div class="modal-one-click__hint">
        <atomic-icon id="info" class="modal-one-click__hint-icon"/>
        <div class="modal-one-click__hint-text" v-html="marked.parse(getContent(popupsData, defaultLocalePopupsData, 'oneClick.hint') || '')"></div>
      </div>
      
      <div class="modal-one-click__actions">
        <button-base type="primary" size="md" class="save-to-file-btn">
          {{ getContent(popupsData, defaultLocalePopupsData, 'oneClick.saveToFileButton') }}
        </button-base>
        
        <button-base type="secondary" size="md" class="save-as-picture-btn">
          {{ getContent(popupsData, defaultLocalePopupsData, 'oneClick.saveAsPictureButton') }}
        </button-base>
        
        <button-base type="secondary" size="md" class="send-email-btn">
          {{ getContent(popupsData, defaultLocalePopupsData, 'oneClick.sendEmailButton') }}
        </button-base>
      </div>
    
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  const { getContent } = useProjectMethods();
  
  const loginValue = '8425749587';
  const passwordValue = 'f6dg53#2gdr';
</script>

<style src="~/assets/styles/components/modal/one-click.scss" lang="scss"/>

