<template>
  <div class="phone-verification">
    <h2 class="phone-verification__title">
      {{ getContent(verificationContent, defaultLocaleVerificationContent, 'phone.title') }}
    </h2>

    <template v-if="profile?.phone">
      <div class="phone-verification__status">
        <span class="phone-verification__status-target">+{{ profile.phone }}</span>
        <atomic-icon v-if="profile?.phoneConfirmed" id="done" class="is-success" />
        <atomic-icon v-else id="warning" class="is-warning" />
        <atomic-icon v-if="phoneEditable" id="close" class="phone-verification__status-close" @click="removePhone" />
      </div>

      <div v-if="serverFormErrors.phone?.length" class="hint variant-error phone-verification__error">
        {{ serverFormErrors.phone[0] }}
      </div>
    </template>

    <form-input-phone
      v-else-if="!showPhoneVerification"
      v-model:value="verificationFormData.phone"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.phone.label') || ''"
      name="verification-phone"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.phone.placeholder') || ''"
      :hint="setError('phone')"
      @blur="v$.phone.$touch()"
      @focus="focusField('phone')"
    />

    <form-phone-verify
      v-if="showPhoneVerification"
      :phone="profile?.phone as string"
      reason="phoneVerification"
      :error-hint="verificationError"
      :loading="verifyLoading"
      :button-label="
        getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'phoneVerification.verifyButton')
      "
      @verify-phone="verifyPhone"
      @remove-error-hint="verificationError = undefined"
    />

    <template v-if="!showPhoneVerification">
      <button-base
        v-if="!profile?.phone"
        key="add"
        type="primary"
        size="md"
        :is-disabled="
          v$.$invalid || !verificationFormData.phone || serverFormErrors?.phone || savingPhone || removingPhone
        "
        @click="savePhoneNumber"
      >
        <atomic-spinner :is-shown="savingPhone" />
        {{ getContent(verificationContent, defaultLocaleVerificationContent, 'phone.addButton') }}
      </button-base>

      <button-base
        v-else-if="profile?.phone && !profile?.phoneConfirmed"
        key="verify"
        type="primary"
        size="md"
        :is-disabled="sendingCode || removingPhone"
        @click="sendVerifyCode"
      >
        <atomic-spinner :is-shown="sendingCode" />
        {{ getContent(verificationContent, defaultLocaleVerificationContent, 'phone.verifyButton') }}
      </button-base>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileVerification } from '~/types';
  import { sendOtp, phoneVerification } from '@skeleton/api/auth';
  import { changeProfileData } from '@skeleton/api/profile';
  import { getFormRules } from '@skeleton/helpers/formMethods';

  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const { setProfileData } = profileStore;
  const globalStore = useGlobalStore();
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const phoneEditable = computed(() => profileFields.value.find(field => field.name === 'phone')?.editable);
  const { fieldsSettings, defaultLocaleFieldsSettings, globalComponentsContent, defaultLocaleGlobalComponentsContent } =
    storeToRefs(globalStore);
  const verificationContent = ref<Maybe<IProfileVerification>>(inject('verificationContent'));
  const defaultLocaleVerificationContent = ref<Maybe<IProfileVerification>>(inject('defaultLocaleVerificationContent'));

  const showPhoneVerification = ref(false);
  const verificationError = ref<{ variant: string; message: string } | undefined>();
  const verificationRules = {
    phone: [{ rule: 'phone' }],
  };
  const verificationFormRules = getFormRules(verificationRules);
  const verificationFormData = reactive({
    phone: '',
  });
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(verificationFormRules, verificationFormData);

  const focused = ref<boolean>(false);
  const focusField = (fieldName: string): void => {
    focused.value = true;
    onFocus(fieldName);
  };

  const savingPhone = ref(false);
  const savePhoneNumber = async (): Promise<void> => {
    if (v$.value.$invalid || savingPhone.value || removingPhone.value) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;
    savingPhone.value = true;

    try {
      const submitResult = await changeProfileData(verificationFormData);
      setProfileData(submitResult);
      useEvent('profileUpdated');
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
        await nextTick();
      } else throw error;
    }

    savingPhone.value = false;
  };

  const sendingCode = ref(false);
  const sendVerifyCode = async (): Promise<void> => {
    if (sendingCode.value || removingPhone.value) return;
    sendingCode.value = true;

    try {
      await sendOtp({ phone: profile.value?.phone as string, reason: 'phoneVerification' });
      showPhoneVerification.value = true;
    } catch (error: any) {
      if (error.data?.error?.code === 11005) {
        const limitError = getContent(
          globalComponentsContent.value,
          defaultLocaleGlobalComponentsContent.value,
          'phoneVerification.limitError'
        );
        serverFormErrors.value = { phone: [limitError] };
      } else {
        serverFormErrors.value = { phone: [error.data?.error?.message] };
      }
    }

    sendingCode.value = false;
  };

  const verifyLoading = ref(false);
  const verifyPhone = async (verificationCode: string): Promise<void> => {
    if (verifyLoading.value || removingPhone.value) return;
    verifyLoading.value = true;

    try {
      await phoneVerification({
        phone: profile.value?.phone as string,
        reason: 'phoneVerification',
        code: verificationCode,
      });
      await profileStore.getProfileData();
      showPhoneVerification.value = false;
    } catch (error: any) {
      if (error.data?.error?.code === 11003) {
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
    }
    verifyLoading.value = false;
  };

  const removingPhone = ref(false);
  const removePhone = async (): Promise<void> => {
    if (removingPhone.value || savingPhone.value || sendingCode.value || verifyLoading.value) return;
    removingPhone.value = true;

    try {
      const submitResult = await changeProfileData({ phone: '' });
      if (verificationFormData.phone) verificationFormData.phone = '';
      verificationError.value = undefined;
      v$.value.$reset();
      if (serverFormErrors.value.phone) {
        delete serverFormErrors.value.phone;
      }
      setProfileData(submitResult);
      useEvent('profileUpdated');
      showPhoneVerification.value = false;
    } catch (error: any) {
      verificationError.value = {
        variant: 'error',
        message: error.data?.error?.message || 'Cannot remove phone number',
      };
    }

    removingPhone.value = false;
  };
</script>

<style src="~/assets/styles/components/verification/phone.scss" lang="scss" />
