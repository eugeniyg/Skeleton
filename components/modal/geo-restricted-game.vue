<template>
  <vue-final-modal
    class="modal-geo-restricted-game"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="close" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>
      
      <atomic-image :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image') "/>
      
      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>
      
      <div class="actions">
        <button-base type="primary" size="md" @click.once="confirm">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button.label') }}
        </button-base>
      </div>
    </div>
  
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';
  
  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['geoRestrictedGame']>;
    defaultLocaleData: Maybe<IModalsContent['geoRestrictedGame']>;
  }>();
  
  const { getContent, localizePath } = useProjectMethods();
  const { closeModal } = useModalStore();
  const router = useRouter();
  
  const url = computed(() => {
    return localizePath(getContent(props.currentLocaleData, props.defaultLocaleData, 'button.url') || '/main')
  });
  
  const close = async () => {
    await router.push(localizePath('/main'));
    await closeModal('geo-restricted-game');
  };
  
  const confirm = async (): Promise<void> => {
    await router.push(url.value);
    await closeModal('geo-restricted-game');
  };
</script>

<style src="~/assets/styles/components/modal/geo-restricted-game.scss" lang="scss" />