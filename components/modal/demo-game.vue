<template>
  <vue-final-modal
    v-model="modalVisible"
    class="modal-demo-game"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="modalVisible = false" />
        <div class="title">{{ props.content?.label }}</div>
      </div>

      <p class="text">{{ props.content?.description }}</p>

      <div class="actions">
        <button-base type="primary" size="md" @click.once="confirm">
          {{ props.content?.[modalType] }}
        </button-base>

        <button-base type="secondary" size="md" @click="modalVisible = false">
          {{ props.content?.demo }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IGamePage } from '~/types';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    content?: IGamePage['demoModal'];
    isDemo: boolean;
  }>();

  const emit = defineEmits(['playReal']);

  const modalVisible = ref<boolean>(false);
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);

  const modalType = computed<'real' | 'deposit' | 'registration'>(() => {
    if (!isLoggedIn.value) return 'registration';
    if (activeAccount.value?.balance ?? 0 > 0) return 'real';
    return 'deposit';
  });

  const { openModal, openWalletModal } = useModalStore();
  let timer: any;
  const confirm = async (): Promise<void> => {
    if (modalType.value === 'real') emit('playReal');
    else if (modalType.value === 'deposit') await openWalletModal('deposit');
    else if (modalType.value === 'registration') await openModal('sign-up');

    modalVisible.value = false;
    clearTimeout(timer);
  };

  const startTimer = (): void => {
    timer = setTimeout(() => {
      modalVisible.value = true;
    }, 60000);
  };

  watch(
    () => props.isDemo,
    (newValue: boolean) => {
      if (!newValue) clearTimeout(timer);
    }
  );

  onBeforeMount(() => {
    if (props.isDemo) {
      const { mobileGameModalInfo } = useGamesStore();
      if (!isLoggedIn.value && !mobileGameModalInfo) modalVisible.value = true;
      startTimer();
    }
  });

  onBeforeUnmount(() => {
    clearTimeout(timer);
  });
</script>

<style src="~/assets/styles/components/modal/demo-game.scss" lang="scss" />
