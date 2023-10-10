<template>
  <vue-final-modal
    v-model="openModal"
    class="modal-demo-game"
    :clickToClose="false"
    @clickOutside="openModal = false"
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
  import {IGamePage} from "~/types";
  import {storeToRefs} from "pinia";

  const props = defineProps<{
    content: IGamePage['demoModal'];
    isDemo: boolean;
  }>()

  const openModal = ref<boolean>(false);
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);
  const modalType = computed<'real'|'deposit'|'registration'>(() => {
    if (!isLoggedIn.value) return 'registration';
    if (activeAccount.value?.realBalance ?? 0 > 0) return 'real';
    return 'deposit';
  });
  const emit = defineEmits(['closeModal', 'playReal']);
  const { getContent } = useProjectMethods();

  const { openDepositModal, showModal } = useLayoutStore();
  const confirm = async (): Promise<void> => {
    if (modalType.value === 'real') emit('playReal');

    if (modalType.value === 'deposit') {
      await openDepositModal();
    }

    if (modalType.value === 'registration') {
      showModal('register');
    }

    openModal.value = false
  }

  let timer: any;
  const startTimer = (): void => {
    if (['registration', 'deposit'].includes(modalType.value)) {
      timer = setTimeout(() => {
        openModal.value = true
      }, 20000);
    } else {
      timer = setTimeout(() => {
        openModal.value = true
      }, 60000);
    }
  }

  watch(() => props.isDemo, (newValue: boolean) => {
    if (!newValue) clearTimeout(timer);
  })

  onBeforeMount(() => {
    if (props.isDemo) startTimer();
  })

  onBeforeUnmount(() => {
    clearTimeout(timer);
  })
</script>

<style src="~/assets/styles/components/modal/demo-game.scss" lang="scss" />
