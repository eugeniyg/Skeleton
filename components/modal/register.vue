<template>
  <vue-final-modal
    v-model="modals.register"
    class="modal-register"
    displayDirective="show"
    @closed="closedEvent"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @close="openCancelModal"/>

      <div class="slot">
        <atomic-promo/>
      </div>

      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="header">
          <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'registration.title') }}</div>
        </div>

        <form-join
          v-if="registrationFields.length"
          :registrationFields="registrationFields"
          :key="formKey"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { IField } from '@skeleton/core/types';
import { VueFinalModal } from 'vue-final-modal';

  const formKey = ref<number>(0);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const hasOffset = ref<boolean>(false);

  const openCancelModal = () => {
    closeModal('register');
    showModal('registerCancel');
  };

  const closedEvent = ():void => {
    if (!modals.value.registerCancel) formKey.value += 1;
  };

  const scrollBlock = ref();
  const handleScroll = (): void => {
    hasOffset.value = scrollBlock.value.scrollTop !== 0;
  }

  watch(() => modals.value.registerCancel, (newValue: boolean) => {
    if (!newValue && !modals.value.register) formKey.value += 1;
  });

  const registrationFields = ref<IField[]>([]);
  const { getRegistrationFields } = useCoreAuthApi();
  onMounted(async () => {
    console.log('hello');
    registrationFields.value = await getRegistrationFields();
  });
</script>

<style src="~/assets/styles/components/modal/register.scss" lang="scss" />

