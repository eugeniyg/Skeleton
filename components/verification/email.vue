<template>
  <div class="email-verification">
    <h2 class="email-verification__title">
      {{ getContent(verificationContent, defaultLocaleVerificationContent, 'email.title') }}
    </h2>

    <div v-if="profile?.email" class="email-verification__status">
      <span>{{ profile.email }}</span>
      <atomic-icon v-if="profile?.confirmedAt" id="done" class="is-success" />
      <atomic-icon v-else id="warning" class="is-warning" />
    </div>

    <form-input-text
      v-else
      v-model:value="verificationFormData.email"
      type="email"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.label') || ''"
      name="name"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.placeholder') || ''"
      :hint="setError('email')"
      @blur="v$.email.$touch()"
      @focus="focusField('email')"
    />

    <button-base
      v-if="!profile?.email"
      key="add"
      type="primary"
      size="md"
      :is-disabled="v$.$invalid || !verificationFormData.email || serverFormErrors?.email"
      @click="addEmail"
    >
      {{ getContent(verificationContent, defaultLocaleVerificationContent, 'email.addButton') }}
    </button-base>

    <button-base
      v-else-if="profile?.email && !profile?.confirmedAt"
      key="verify"
      type="primary"
      size="md"
      :is-disabled="resentVerifyEmail"
      @click.once="profileStore.resendVerifyEmail"
    >
      {{ getContent(verificationContent, defaultLocaleVerificationContent, 'email.verifyButton') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileVerification } from '~/types';
  import { changeProfileData } from '@skeleton/api/profile';
  import { getFormRules } from '@skeleton/helpers/formMethods';

  const profileStore = useProfileStore();
  const { profile, resentVerifyEmail } = storeToRefs(profileStore);
  const { setProfileData } = profileStore;
  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings } = storeToRefs(globalStore);
  const verificationContent = ref<Maybe<IProfileVerification>>(inject('verificationContent'));
  const defaultLocaleVerificationContent = ref<Maybe<IProfileVerification>>(inject('defaultLocaleVerificationContent'));

  const verificationRules = {
    email: [{ rule: 'email' }],
  };
  const verificationFormRules = getFormRules(verificationRules);
  const verificationFormData = reactive({
    email: '',
  });
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(verificationFormRules, verificationFormData);

  const focused = ref<boolean>(false);
  const focusField = (fieldName: string): void => {
    focused.value = true;
    onFocus(fieldName);
  };

  const saveEmailLoading = ref(false);
  const addEmail = async (): Promise<void> => {
    if (v$.value.$invalid || saveEmailLoading.value) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    saveEmailLoading.value = true;
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
    saveEmailLoading.value = false;
  };
</script>

<style src="~/assets/styles/components/verification/email.scss" lang="scss" />
