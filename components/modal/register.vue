<template>
  <vue-final-modal
    v-model="modals.register"
    class="modal-register"
    displayDirective="show"
    @closed="closedEvent"
    :clickToClose="false"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @close="showModal('registerCancel');"/>

      <div class="slot">
        <atomic-promo/>
      </div>

      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="header">
          <div class="title">{{ formTitle }}</div>

          <div v-if="showPhoneVerification" class="header__back-btn" @click="showRegistrationForm">
            <span class="header__back-btn-icon">
              <atomic-icon id="arrow_previous"/>
            </span>

            <span class="header__back-btn-text">
              {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.backButton') }}
            </span>
          </div>
        </div>

        <form-phone-verify
          v-if="showPhoneVerification"
          :registrationData="registrationData"
        />

        <form-join
          v-else-if="registrationFields.length"
          :registrationFields="registrationFields"
          :key="formKey"
          @showVerification="showVerification"
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
  const showPhoneVerification = ref<boolean>(false);
  const formTitle = computed(() => {
    if (showPhoneVerification.value) return getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.title');
    return getContent(popupsData, defaultLocalePopupsData, 'registration.title');
  })
  const registrationData = ref<Record<string, any>|undefined>();

  const closedEvent = ():void => {
    showPhoneVerification.value = false;
    if (!modals.value.registerCancel) formKey.value += 1;
  };

  const scrollBlock = ref();
  const handleScroll = (): void => {
    hasOffset.value = scrollBlock.value.scrollTop !== 0;
  }

  const showVerification = (formData: Record<string, any>):void => {
    registrationData.value = formData;
    showPhoneVerification.value = true;
  }

  const showRegistrationForm = ():void => {
    showPhoneVerification.value = false;
  }

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

