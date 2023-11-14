<template>
  <vue-final-modal
    v-model="openModal"
    class="modal-demo-game"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="openModal = false"/>
        <div class="title">{{ props.content.label }}</div>
      </div>

      <p class="text">{{ props.content.description }}</p>

      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click.once="confirm"
        >
          {{ props.content[modalType] }}
        </button-base>

        <button-base
          type="secondary"
          size="md"
          @click="openModal = false"
        >
          {{ props.content.demo }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IGamePage } from "~/types";
  import { storeToRefs } from "pinia";

  const props = defineProps<{
    content: IGamePage['demoModal'];
    isDemo: boolean;
  }>()

  const emit = defineEmits(['playReal']);

  const openModal = ref<boolean>(false);
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);

  const modalType = computed<'real'|'deposit'|'registration'>(() => {
    if (!isLoggedIn.value) return 'registration';
    if (activeAccount.value?.balance ?? 0 > 0) return 'real';
    return 'deposit';
  });

  const { openWalletModal, showModal } = useLayoutStore();
  let timer: any;
  const confirm = async (): Promise<void> => {
    if (modalType.value === 'real') emit('playReal');
    else if (modalType.value === 'deposit') await openWalletModal('deposit');
    else if (modalType.value === 'registration') showModal('register');

    openModal.value = false
    clearTimeout(timer);
  }

  const startTimer = (): void => {
    timer = setTimeout(() => {
      openModal.value = true
    }, 60000);
  }

  watch(() => props.isDemo, (newValue: boolean) => {
    if (!newValue) clearTimeout(timer);
  })

  onBeforeMount(() => {
    if (props.isDemo) {
      const { mobileGameModalInfo } = useGamesStore();
      if (!isLoggedIn.value && !mobileGameModalInfo) openModal.value = true;
      startTimer();
    }
  })

  onBeforeUnmount(() => {
    clearTimeout(timer);
  })
</script>

<style src="~/assets/styles/components/modal/demo-game.scss" lang="scss" />
