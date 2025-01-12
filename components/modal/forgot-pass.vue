<template>
  <vue-final-modal
    class="modal-forgot-pass"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @closed="modalClosed"
  >
    <div class="scroll">
      <div class="header">
        <button class="modal-forgot-pass__previous" @click.prevent="returnLoginModal">
          <atomic-icon id="arrow_previous" />
        </button>

        <div class="title">
          <template v-if="showPhoneVerification">
            {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.title') }}
          </template>

          <template v-else>
            {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
          </template>
        </div>

        <button class="modal-forgot-pass__close" @click.prevent="closeModal('forgot-pass')">
          <atomic-icon id="close" />
        </button>
      </div>

      <p v-if="!showPhoneVerification" class="text">
        {{
          getContent(
            props.currentLocaleData,
            props.defaultLocaleData,
            `${selectedTab === 'email' ? 'emailDescription' : 'phoneDescription'}`
          )
        }}
      </p>

      <template v-if="tabsList.length && forgotType === 'both' && !showPhoneVerification">
        <div class="modal-forgot-pass__tabs">
          <button-base
            v-for="tab in tabsList"
            :key="tab.id"
            :is-active="tab.id === selectedTab"
            size="xs"
            @click="changeTab(tab.id as 'email' | 'phone')"
          >
            <atomic-icon :id="tab.icon" />
            <span class="text">{{ tab.label }}</span>
          </button-base>
        </div>

        <atomic-divider class="modal-forgot-pass__tabs-divider" />
      </template>

      <transition name="fade" mode="out-in" :duration="100">
        <form-forgot-pass-email
          v-if="selectedTab === 'email'"
          key="email"
          :current-locale-data="props.currentLocaleData"
          :default-locale-data="props.defaultLocaleData"
        />

        <div v-else key="phone">
          <form-forgot-pass-phone
            v-show="!showPhoneVerification"
            :current-locale-data="props.currentLocaleData"
            :default-locale-data="props.defaultLocaleData"
            @send-otp="sendOtp"
          />

          <form-phone-verify
            v-if="showPhoneVerification"
            :phone="verificationPhone"
            reason="changingPass"
            :error-hint="verificationError"
            :loading="sendingData"
            :button-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'forgotButton')"
            @verify-phone="verifyPhone"
            @remove-error-hint="verificationError = undefined"
          />
        </div>
      </transition>

      <button-popup
        v-if="!showPhoneVerification"
        :button-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'registrationButton') || ''"
        modal="sign-up"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';
  import modalsMap from '@skeleton/maps/modalsMap.json';
  import type { IModalSettings } from '@skeleton/types';
  const modalsList: Record<string, IModalSettings> = modalsMap;

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['forgot']>;
    defaultLocaleData: Maybe<IModalsContent['forgot']>;
  }>();

  const signInContentParams = {
    contentKey: 'modal-sign-in',
    contentRoute: ['modals', modalsList['sign-in'].content as string],
  };
  const { getContentData: getSignInContentData } = useContentLogic(signInContentParams);
  const { data: signInContent } = await useLazyAsyncData(getSignInContentData);

  const modalStore = useModalStore();
  const { openModal, closeModal } = modalStore;

  const { settingsConstants, globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const showPhoneVerification = ref<boolean>(false);

  const returnLoginModal = () => {
    if (showPhoneVerification.value) {
      showPhoneVerification.value = false;
      verificationError.value = undefined;
    } else openModal('sign-in');
  };

  const forgotType = computed(() => {
    const otpEnabled = settingsConstants?.player.otp.enabled;
    const forgotTypeContent = getContent(props.currentLocaleData, props.defaultLocaleData, 'tabsDisplay') || 'both';

    if (otpEnabled) return forgotTypeContent;
    return 'email';
  });

  const tabsList = computed(() => {
    const tabsObj = getContent(signInContent.value?.currentLocaleData, signInContent.value?.defaultLocaleData, 'tabs');
    if (!tabsObj) return [];

    return Object.keys(tabsObj).map(key => {
      if (key === 'email') return { id: 'email', icon: 'mail', label: tabsObj[key] };
      return { id: 'phone', icon: 'mobile', label: tabsObj[key] };
    });
  });
  const selectedTab = ref<'email' | 'phone'>(forgotType.value === 'both' ? 'email' : forgotType.value);

  const changeTab = (newTabId: 'email' | 'phone'): void => {
    if (selectedTab.value === newTabId) return;
    selectedTab.value = newTabId;
  };

  const modalClosed = (): void => {
    showPhoneVerification.value = false;
    selectedTab.value = 'email';
  };

  const verificationPhone = ref<string>('');
  const sendOtp = (completeData: { [key: string]: any }): void => {
    verificationPhone.value = completeData.phone;
    showPhoneVerification.value = true;
  };

  const showResetModal = async (code: string): Promise<void> => {
    const router = useRouter();
    const route = useRoute();
    await openModal('reset-pass', { prohibitQueryChange: false });
    router.push({ query: { ...route.query, 'forgot-pass': undefined, 'reset-pass': 'true', resetCode: code } });
    modalStore.modals['forgot-pass']?.close();
  };

  const sendingData = ref<boolean>(false);
  const verificationError = ref<{ variant: string; message: string } | undefined>();
  const verifyPhone = async (verificationCode: string): Promise<void> => {
    try {
      sendingData.value = true;
      const { phoneVerification } = useCoreAuthApi();
      const { code } = await phoneVerification({
        phone: verificationPhone.value,
        code: verificationCode,
        reason: 'changingPass',
      });
      await showResetModal(code);
    } catch (error: any) {
      if (error.data?.error?.code === 11003) {
        verificationError.value = {
          variant: 'error',
          message: getContent(
            globalComponentsContent,
            defaultLocaleGlobalComponentsContent,
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
</script>

<style src="~/assets/styles/components/modal/forgot-pass.scss" lang="scss" />
