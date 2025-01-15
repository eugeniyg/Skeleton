<template>
  <vue-final-modal
    class="modal-bonus-cancel-lock"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('bonus-cancel-lock')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('bonus-cancel-lock')" />
        <div class="title">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
        </div>
      </div>

      <div class="modal-bonus-cancel-lock__image">
        <atomic-image :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')" />
      </div>

      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>

      <button-base
        v-if="getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton')"
        type="primary"
        size="md"
        @click="clickConfirm"
      >
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['bonusCancelLock']>;
    defaultLocaleData: Maybe<IModalsContent['bonusCancelLock']>;
  }>();

  const { getContent, localizePath } = useProjectMethods();
  const { closeModal } = useModalStore();

  const router = useRouter();
  const clickConfirm = async (): Promise<void> => {
    const buttonLink = getContent(props.currentLocaleData, props.defaultLocaleData, 'buttonLink');
    if (buttonLink) {
      if (buttonLink.startsWith('http')) {
        window.open(buttonLink, '_blank');
      } else {
        await router.push(localizePath(buttonLink));
      }
    }
    await closeModal('bonus-cancel-lock');
  };
</script>

<style src="~/assets/styles/components/modal/bonus-cancel-lock.scss" lang="scss" />
