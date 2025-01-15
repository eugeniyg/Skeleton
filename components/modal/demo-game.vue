<template>
  <vue-final-modal
    class="modal-demo-game"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('demo-game')" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'label') }}</div>
      </div>

      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>

      <div class="actions">
        <button-base type="primary" size="md" @click.once="confirm">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, `${modalType}`) }}
        </button-base>

        <button-base type="secondary" size="md" @click="closeModal('demo-game')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'demo') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['demoGame']>;
    defaultLocaleData: Maybe<IModalsContent['demoGame']>;
  }>();

  const emit = defineEmits(['playReal']);
  const { getContent } = useProjectMethods();
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);

  const modalType = computed<'real' | 'deposit' | 'registration'>(() => {
    if (!isLoggedIn.value) return 'registration';
    if (activeAccount.value?.balance ?? 0 > 0) return 'real';
    return 'deposit';
  });

  const { openModal, openWalletModal, closeModal } = useModalStore();
  const confirm = async (): Promise<void> => {
    if (modalType.value === 'real') emit('playReal');
    else if (modalType.value === 'deposit') await openWalletModal('deposit');
    else if (modalType.value === 'registration') await openModal('sign-up');

    await closeModal('demo-game');
  };
</script>

<style src="~/assets/styles/components/modal/demo-game.scss" lang="scss" />
