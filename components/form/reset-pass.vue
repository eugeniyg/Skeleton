<template>
  <form class="form-reset-pass">
    <form-input-password
      v-model:value="resetFormData.newPassword"
      type="password"
      name="newPassword"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.newPassword.label') || ''"
      :placeholder="
        getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.newPassword.placeholder') || ''
      "
      :is-required="true"
      :hint="setError('newPassword')"
      @blur="v$.newPassword?.$touch()"
      @focus="onFocus('newPassword')"
      @input="inputNewPassword"
    />

    <form-input-password
      v-model:value="resetFormData.repeatNewPassword"
      type="password"
      name="repeatNewPassword"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.repeatNewPassword.label') || ''"
      :placeholder="
        getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.repeatNewPassword.placeholder') || ''
      "
      :is-required="true"
      :hint="setError('repeatNewPassword')"
      @blur="v$.repeatNewPassword?.$touch()"
      @focus="onFocus('repeatNewPassword')"
    />

    <button-base
      tag-name="div"
      type="primary"
      size="md"
      :is-disabled="v$.$invalid || isLockedAsyncButton"
      @click="resetPassword"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton" />
      {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'resetButton') }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import type { IModalsContent } from '~/types';
  import { resetProfilePassword } from '@skeleton/api/profile';
  import { createValidationRules, getFormRules } from '@skeleton/helpers/formMethods';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['reset']>;
    defaultLocaleData: Maybe<IModalsContent['reset']>;
  }>();

  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings, alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const resetFormData = reactive({
    newPassword: '',
    repeatNewPassword: '',
  });

  const resetRules = createValidationRules(Object.keys(resetFormData).map(field => ({ name: field })));
  const resetFormRules = getFormRules(resetRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(resetFormRules, resetFormData);

  const inputNewPassword = (): void => {
    if (v$.value.repeatNewPassword.$dirty) {
      const oldValue = resetFormData.repeatNewPassword;
      resetFormData.repeatNewPassword = '';
      resetFormData.repeatNewPassword = oldValue;
    }
  };

  const { showAlert } = useLayoutStore();
  const { closeModal } = useModalStore();
  const showErrorAlert = (): void => {
    showAlert(alertsData.value?.profile?.invalidResetCode || defaultLocaleAlertsData.value?.profile?.invalidResetCode);
  };

  const isLockedAsyncButton = ref<boolean>(false);
  const resetPassword = async (): Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      const route = useRoute();
      await resetProfilePassword({ ...resetFormData, code: route.query.resetCode as string });
      showAlert(alertsData.value?.profile?.passwordChanged || defaultLocaleAlertsData.value?.profile?.passwordChanged);
      closeModal('reset-pass');
    } catch (error: any) {
      if (error.response?.status === 422) {
        if (error.data?.error?.fields.code) showErrorAlert();
        else serverFormErrors.value = error.data?.error?.fields;
      } else showErrorAlert();
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/form/reset-pass.scss" lang="scss" />
