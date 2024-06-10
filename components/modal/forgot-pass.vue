<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    class="modal-forgot-pass"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @closed="modalClosed"
  >
    <div class="scroll">
      <div class="header">
        <button class="modal-forgot-pass__previous" @click.prevent="returnLoginModal">
          <atomic-icon id="arrow_previous"/>
        </button>

        <div class="title">
          <template v-if="showPhoneVerification">
            {{ getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.title') }}
          </template>

          <template v-else>
            {{ getContent(popupsData, defaultLocalePopupsData, 'forgot.title') }}
          </template>
        </div>

        <button class="modal-forgot-pass__close" @click.prevent="closeModal('forgotPass')">
          <atomic-icon id="close"/>
        </button>
      </div>

      <p v-if="!showPhoneVerification" class="text">
        {{ getContent(popupsData, defaultLocalePopupsData, `forgot.${selectedTab === 'email' ? 'emailDescription' : 'phoneDescription'}`) }}
      </p>

      <template v-if="tabsList.length && !showPhoneVerification">
        <div  class="modal-sign-in__tabs">
          <button-base
            v-for="tab in tabsList"
            :key="tab.id"
            :isActive="tab.id === selectedTab"
            size="xs"
            @click="changeTab(tab.id as 'email'|'phone')"
          >
            <atomic-icon :id="tab.icon" />
            <span class="text">{{ tab.label }}</span>
          </button-base>
        </div>

        <atomic-divider class="modal-sign-in__tabs-divider" />
      </template>

      <transition name="fade" mode="out-in" :duration="100">
        <form-forgot-pass-email key="email" v-if="selectedTab === 'email'" />

        <div key="phone" v-else>
          <form-forgot-pass-phone
            v-show="!showPhoneVerification"
            @sendOtp="sendOtp"
          />

          <form-phone-verify
            v-if="showPhoneVerification"
            :phone="verificationPhone"
            reason="changingPass"
            :errorHint="verificationError"
            :loading="sendingData"
            :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'forgot.forgotButton')"
            @verifyPhone="verifyPhone"
            @removeErrorHint="verificationError = undefined"
          />
        </div>
      </transition>

      <button-popup
        v-if="!showPhoneVerification"
        :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'forgot.registrationButton') || ''"
        openModal="register"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;

  const { popupsData, defaultLocalePopupsData, settingsConstants } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const showPhoneVerification = ref<boolean>(false);

  const returnLoginModal = () => {
    if (showPhoneVerification.value) {
      showPhoneVerification.value = false;
      verificationError.value = undefined;
    } else showModal('signIn');
  };

  const hasPhoneRegistration = settingsConstants?.player?.registration?.phone;
  const tabsList = computed(() => {
    const tabsObj = getContent(popupsData, defaultLocalePopupsData, 'login.tabs');
    if (!tabsObj || !hasPhoneRegistration) return [];

    return Object.keys(tabsObj).map(key => {
      if (key === 'email') return { id: 'email', icon: 'mail', label: tabsObj[key] };
      return { id: 'phone', icon: 'mobile', label: tabsObj[key] };
    })
  });
  const selectedTab = ref<'email'|'phone'>('email');

  const changeTab = (newTabId: 'email'|'phone'): void => {
    if (selectedTab.value === newTabId) return;
    selectedTab.value = newTabId;
  }

  const modalClosed = (): void => {
    showPhoneVerification.value = false;
    selectedTab.value = 'email';
  }

  const verificationPhone = ref<string>('');
  const sendOtp = (completeData: { [key: string]: any }): void => {
    verificationPhone.value = completeData.phone;
    showPhoneVerification.value = true;
  }

  const showResetModal = async (code: string):Promise<void> => {
    const layoutStore = useLayoutStore();
    const router = useRouter();
    const route = useRoute();
    layoutStore.closeModal('forgotPass');
    await router.push({ query: { ...route.query, 'reset-pass': 'true', resetCode: code } });
    layoutStore.modals.resetPass = true;
  }

  const sendingData = ref<boolean>(false);
  const verificationError = ref<{ variant: string, message: string }|undefined>();
  const verifyPhone = async (verificationCode: string):Promise<void> => {
    try {
      sendingData.value = true;
      const { phoneVerification } = useCoreAuthApi();
      const { code } = await phoneVerification({
        phone: verificationPhone.value,
        code: verificationCode,
        reason: 'changingPass'
      });
      await showResetModal(code);
    } catch (error: any) {
      if (error.data?.error?.code === 11003) {
        verificationError.value = {
          variant: 'error',
          message: getContent(popupsData, defaultLocalePopupsData, 'phoneVerification.invalidError')
        };
      } else {
        throw error;
      }
    } finally {
      sendingData.value = false;
    }
  }
</script>

<style src="~/assets/styles/components/modal/forgot-pass.scss" lang="scss" />

