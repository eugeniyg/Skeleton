<template>
  <vue-final-modal
    class="modal-register"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @before-open="beforeOpenHandle"
    @opened="openedHandle"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @close="openModal('sign-up-cancel')" />

      <div class="slot">
        <atomic-promo :current-locale-data="props.currentLocaleData" :default-locale-data="props.defaultLocaleData" />
      </div>

      <div ref="scrollBlock" class="scroll" @scroll="handleScroll">
        <div class="header">
          <div
            class="title"
            v-html="DOMPurify.sanitize(marked.parse(formTitle || '') as string, { FORBID_TAGS: ['style'] })"
          />

          <div v-if="showPhoneVerification" class="header__back-btn" @click="showRegistrationForm">
            <span class="header__back-btn-icon">
              <atomic-icon id="arrow_previous" />
            </span>

            <span class="header__back-btn-text">
              {{
                getContent(
                  globalComponentsContent,
                  defaultLocaleGlobalComponentsContent,
                  'phoneVerification.backButton'
                )
              }}
            </span>
          </div>
        </div>

        <form-phone-verify
          v-if="showPhoneVerification"
          :phone="registrationData?.phone"
          reason="registration"
          :error-hint="verificationError"
          :loading="sendingData"
          :button-label="
            getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.verifyButton')
          "
          @verify-phone="phoneRegister"
          @remove-error-hint="verificationError = undefined"
        />

        <template v-else-if="registrationType === 'emailOrPhone'">
          <div class="modal-register__tabs">
            <button-base
              v-for="tab in registrationTypeTabs"
              :key="tab.id"
              :is-active="tab.id === selectedTab"
              size="xs"
              @click="changeTabHandle(tab.id)"
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
          :key="`${selectedTab}`"
          :selected-tab="selectedTab"
          :registration-fields="registrationFields"
          :current-locale-data="props.currentLocaleData"
          :default-locale-data="props.defaultLocaleData"
          @show-verification="showVerification"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import type { RegistrationType } from '@skeleton/api/types';
  import { VueFinalModal } from 'vue-final-modal';
  import type { Dayjs } from 'dayjs';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['registration']>;
    defaultLocaleData: Maybe<IModalsContent['registration']>;
  }>();

  const fieldsStore = useFieldsStore();
  const { registrationFields } = storeToRefs(fieldsStore);
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { settingsConstants, globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const hasOffset = ref<boolean>(false);
  const showPhoneVerification = ref<boolean>(false);
  const formTitle = computed(() => {
    if (showPhoneVerification.value)
      return getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'phoneVerification.title'
      );
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'title');
  });
  const registrationData = ref<Record<string, any> | undefined>();
  const registrationType = computed<RegistrationType>(() => {
    const emailRegistrationEnabled = settingsConstants.value?.player.registration.email;
    const phoneRegistrationEnabled = settingsConstants.value?.player.registration.phone;
    const contentRegistration = getContent(props.currentLocaleData, props.defaultLocaleData, 'tabsDisplay') || 'both';

    if (emailRegistrationEnabled && phoneRegistrationEnabled) {
      return contentRegistration === 'both' ? 'emailOrPhone' : contentRegistration;
    }

    if (phoneRegistrationEnabled) return 'phone';
    return 'email';
  });
  const registrationTypeTabs = computed<{ id: RegistrationType; label: string; icon: string }[]>(() => {
    if (registrationType.value === 'emailOrPhone')
      return [
        {
          id: 'email',
          label: getContent(props.currentLocaleData, props.defaultLocaleData, 'typeTabs.email'),
          icon: 'mail',
        },
        {
          id: 'phone',
          label: getContent(props.currentLocaleData, props.defaultLocaleData, 'typeTabs.phone'),
          icon: 'mobile',
        },
      ];
    return [];
  });
  const selectedTab = ref<'email' | 'phone'>(
    registrationType.value === 'emailOrPhone' ? 'email' : registrationType.value
  );
  const scrollBlock = ref();
  const handleScroll = (): void => {
    hasOffset.value = scrollBlock.value.scrollTop !== 0;
  };

  const showVerification = (formData: Record<string, any>): void => {
    registrationData.value = formData;
    showPhoneVerification.value = true;
    useEvent('analyticsEvent', { event: 'registrationOtp' });
  };

  const showRegistrationForm = (): void => {
    showPhoneVerification.value = false;
  };

  const registrationForm = ref();
  const sendingData = ref<boolean>(false);
  const verificationError = ref<{ variant: string; message: string } | undefined>();
  const phoneRegister = async (verificationCode: string): Promise<void> => {
    try {
      sendingData.value = true;
      useEvent('analyticsEvent', { event: 'registrationSubmit' });
      const { phoneRegistration } = useProfileStore();
      await phoneRegistration({ ...registrationData.value, code: verificationCode });
    } catch (error: any) {
      if (error.response?.status === 422) {
        registrationForm.value.setServerErrors(error.data.error.fields);
        showPhoneVerification.value = false;
      } else if (error.data?.error?.code === 11003) {
        verificationError.value = {
          variant: 'error',
          message: getContent(
            globalComponentsContent.value,
            defaultLocaleGlobalComponentsContent.value,
            'phoneVerification.invalidError'
          ),
        };
      } else {
        verificationError.value = {
          variant: 'error',
          message: error.data?.error?.message || 'Cannot verify phone number',
        };
      }
    } finally {
      sendingData.value = false;
    }
  };

  const changeTabHandle = (tabId: 'email' | 'phone') => {
    if (selectedTab.value === tabId) return;

    selectedTab.value = tabId;
    useEvent('analyticsEvent', {
      event: 'registrationChangeType',
      regType: tabId,
    });
  };

  let startModalLoad: Dayjs;
  const dayjs = useDayjs();
  const beforeOpenHandle = () => {
    startModalLoad = dayjs();
  };

  const openedHandle = () => {
    useEvent('analyticsEvent', {
      event: 'registrationOpen',
      loadTime: dayjs().diff(startModalLoad),
    });
  };
</script>

<style src="~/assets/styles/components/modal/sign-up.scss" lang="scss" />
