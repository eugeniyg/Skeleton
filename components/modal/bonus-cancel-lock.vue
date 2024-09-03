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
        <div class="title">{{ props.content?.title }}</div>
      </div>

      <div class="modal-bonus-cancel-lock__image">
        <atomic-image :src="props.content?.image" />
      </div>

      <p class="text">{{ props.content?.description }}</p>

      <button-base
        v-if="props.content?.confirmButton"
        type="primary"
        size="md"
        @click="clickConfirm"
      >
        {{ props.content.confirmButton }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type {IProfileBonuses} from "~/types";

  const props = defineProps<{
    showModal: boolean;
    content?: IProfileBonuses['cancelLockModal'];
  }>()

  const emit = defineEmits(['close']);

  const router = useRouter();
  const clickConfirm = (): void => {
    if (props.content?.buttonLink) {
      if (props.content.buttonLink.startsWith('http')) {
        window.open(props.content.buttonLink, '_blank');
      } else {
        router.push(props.content.buttonLink);
      }
    } else emit('close');
  }
</script>

<style src="~/assets/styles/components/modal/bonus-cancel-lock.scss" lang="scss" />

