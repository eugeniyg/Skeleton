<template>
  <vue-final-modal
    :modelValue="props.showModal"
    class="modal-bonus-cancel-lock"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @click-outside="emit('close')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('close')" />
        <div class="title">
          {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLockModal.title') }}
        </div>
      </div>

      <div class="modal-bonus-cancel-lock__image">
        <atomic-image :src="getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLockModal.image')" />
      </div>

      <p class="text">{{ getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLockModal.description') }}</p>

      <button-base
        v-if="getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLockModal.confirmButton')"
        type="primary"
        size="md"
        @click="clickConfirm"
      >
        {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'cancelLockModal.confirmButton') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type {IProfileBonuses} from "~/types";

  const props = defineProps<{
    showModal: boolean;
  }>()

  const { getContent, localizePath } = useProjectMethods();
  const bonusesContent = ref<Maybe<IProfileBonuses>>(inject('bonusesContent'));
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>(inject('defaultLocaleBonusesContent'));

  const emit = defineEmits(['close']);

  const router = useRouter();
  const clickConfirm = (): void => {
    const buttonLink = getContent(bonusesContent.value, defaultLocaleBonusesContent.value, 'cancelLockModal.buttonLink');
    if (buttonLink) {
      if (buttonLink.startsWith('http')) {
        window.open(buttonLink, '_blank');
      } else {
        router.push(localizePath(buttonLink));
      }
    } else emit('close');
  }
</script>

<style src="~/assets/styles/components/modal/bonus-cancel-lock.scss" lang="scss" />

