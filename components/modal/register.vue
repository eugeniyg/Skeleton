<template>
  <vue-final-modal
    v-model="modals.register"
    class="modal-register"
    displayDirective="show"
    @closed="closedEvent"
    :clickToClose="false"
  >
    <div class="container">
      <div class="slot">
        <atomic-promo/>
      </div>

      <div class="scroll">
        <div class="header">
          <button-modal-close @close="openCancelModal"/>
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
import {storeToRefs} from 'pinia';
import {IField} from '@skeleton/core/types';
import {VueFinalModal} from 'vue-final-modal';

const formKey = ref<number>(0);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const openCancelModal = () => {
    closeModal('register');
    showModal('registerCancel');
  };

  const closedEvent = ():void => {
    if (!modals.value.registerCancel) formKey.value += 1;
  };

  watch(() => modals.value.registerCancel, (newValue: boolean) => {
    if (!newValue && !modals.value.register) formKey.value += 1;
  });

  const registrationFields = ref<IField[]>([]);
  const { getRegistrationFields } = useCoreAuthApi();
  onMounted(async () => {
    registrationFields.value = await getRegistrationFields();
  });
</script>

<style src="~/assets/styles/components/modal/register.scss" lang="scss" />

