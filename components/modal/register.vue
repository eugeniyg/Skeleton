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
          :phone="registrationData?.phone"
          reason="registration"
          :errorHint="verificationError"
          :loading="sendingData"
          :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.verifyButton')"
          @verifyPhone="phoneRegister"
          @removeErrorHint="verificationError = undefined"
        />

        <template v-else-if="registrationType === 'emailOrPhone'">
          <div class="modal-register__tabs">
            <button-base
              v-for="tab in registrationTypeTabs"
              :key="tab.id"
              :isActive="tab.id === selectedTab"
              size="xs"
              @click="selectedTab = tab.id"
            >
              <atomic-icon :id="tab.icon" />
              <span class="text">{{ tab.label }}</span>
            </button-base>
          </div>

          <atomic-divider class="modal-register__tabs-divider" />
        </template>

        <form-join
          v-if="registrationFields.length"
          v-show="!showPhoneVerification"
          ref="registrationForm"
          :registrationFields="registrationFields"
          :key="`${formKey}-${selectedTab}`"
          :registrationType="selectedTab"
          @showVerification="showVerification"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {IField, RegistrationType} from '@skeleton/core/types';
  import { VueFinalModal } from 'vue-final-modal';

  const formKey = ref<number>(0);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { showModal } = layoutStore;
  const globalStore = useGlobalStore();
  const {
    settingsConstants,
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const hasOffset = ref<boolean>(false);
  const showPhoneVerification = ref<boolean>(false);
  const formTitle = computed(() => {
    if (showPhoneVerification.value) return getContent(popupsData.value, defaultLocalePopupsData.value, 'phoneVerification.title');
    return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.title');
  })
  const registrationData = ref<Record<string, any>|undefined>();
  const registrationType = computed<RegistrationType>(() => {
    if (settingsConstants.value?.player.registration.email && settingsConstants.value?.player.registration.phone) return 'emailOrPhone';
    if (settingsConstants.value?.player.registration.email) return 'email';
    if (settingsConstants.value?.player.registration.phone) return 'phone';
    return 'default';
  })
  const registrationTypeTabs = computed<{ id: RegistrationType, label: string, icon: string }[]>(() => {
    if (registrationType.value === 'emailOrPhone') return [
      {
        id: 'email',
        label: getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.typeTabs.email'),
        icon: 'mail'
      },
      {
        id: 'phone',
        label: getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.typeTabs.phone'),
        icon: 'mobile'
      }
    ];
    return [];
  })
  const selectedTab = ref<RegistrationType>(registrationType.value === 'emailOrPhone' ? 'email' : registrationType.value);

  const closedEvent = ():void => {
    showPhoneVerification.value = false;
    if (!modals.value.registerCancel) formKey.value += 1;
    selectedTab.value = registrationType.value === 'emailOrPhone' ? 'email' : registrationType.value;
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

  const registrationForm = ref();
  const sendingData = ref<boolean>(false);
  const verificationError = ref<{ variant: string, message: string }|undefined>();
  const phoneRegister = async (verificationCode: string):Promise<void> => {
    try {
      sendingData.value = true;
      const { phoneRegistration } = useProfileStore();
      await phoneRegistration({ ...registrationData.value, code: verificationCode });
    } catch (error: any) {
      if (error.response?.status === 422) {
        registrationForm.value.setServerErrors(error.data.error.fields);
        showPhoneVerification.value = false;
      } else if (error.data?.error?.code === 11003) {
        verificationError.value = {
          variant: 'error',
          message: getContent(popupsData.value, defaultLocalePopupsData.value, 'phoneVerification.invalidError')
        };
      } else {
        throw error;
      }
    } finally {
      sendingData.value = false;
    }
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

