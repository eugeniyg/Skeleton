<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    class="modal-forgot-pass"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button class="modal-forgot-pass__previous" @click.prevent="returnLoginModal">
          <atomic-icon id="arrow_previous"/>
        </button>

        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'forgot.title') }}</div>

        <button class="modal-forgot-pass__close" @click.prevent="closeModal('forgotPass')">
          <atomic-icon id="close"/>
        </button>
      </div>

      <p class="text">
        {{ getContent(popupsData, defaultLocalePopupsData, `forgot.${selectedTab === 'email' ? 'emailDescription' : 'phoneDescription'}`) }}
      </p>

      <template v-if="tabsList.length">
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

      <transition name="fade" mode="out-in">
        <form-forgot-pass-email key="email" v-if="selectedTab === 'email'" />

        <div key="phone" v-else>
          <form-forgot-pass-phone
            v-show="!showPhoneVerification"
            @sendOtp="sendOtp"
          />

          <phone-verify-2
            v-if="showPhoneVerification"
            :phone="verificationPhone"
            reason="changingPass"
            :errorHint="verificationError"
            :loading="sendingData"
            @verifyPhone="verifyPhone"
          />
        </div>
      </transition>

      <button-popup
        :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'forgot.registrationButton') || ''"
        openModal="register"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import PhoneVerify2 from "@skeleton/components/form/phone-verify-2.vue";

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const showPhoneVerification = ref<boolean>(false);

  const returnLoginModal = () => {
    showModal('signIn');
  };

  const tabsList = computed(() => {
    const tabsObj = getContent(popupsData, defaultLocalePopupsData, 'login.tabs');
    if (!tabsObj) return [];

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

  const verificationPhone = ref<string>('');
  const sendOtp = (completeData: { [key: string]: any }): void => {
    verificationPhone.value = completeData.phone;
    showPhoneVerification.value = true;
  }

  const showResetModal = async (code: string):Promise<void> => {
    const layoutStore = useLayoutStore();
    const router = useRouter();
    layoutStore.closeModal('forgotPass');
    await router.push({ query: { 'reset-pass': 'true', resetCode: code } });
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
      if (error.response?.status === 422) {
        emit('validationError', error.data.error.fields);
      } else if (error.data?.error?.code === 11003) {
        errorHint.value = {
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

