<template>
  <form class="form-reset-pass">
    <form-input-password
      v-model:value="resetFormData.newPassword"
      type="password"
      name="newPassword"
      :label="getContent(fieldsContent, defaultLocaleFieldsContent, 'newPassword.label') || ''"
      :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'newPassword.placeholder') || ''"
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
      :label="getContent(fieldsContent, defaultLocaleFieldsContent, 'repeatNewPassword.label') || ''"
      :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, 'repeatNewPassword.placeholder') || ''"
      :is-required="true"
      :hint="setError('repeatNewPassword')"
      @blur="v$.repeatNewPassword?.$touch()"
      @focus="onFocus('repeatNewPassword')"
    />

    <button-base
      tagName="div"
      type="primary"
      size="md"
      :isDisabled="v$.$invalid || isLockedAsyncButton"
      @click="resetPassword"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton"/>
      {{ getContent(popupsData, defaultLocalePopupsData, 'reset.resetButton') }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const {
    fieldsContent,
    defaultLocaleFieldsContent,
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
  } = storeToRefs(globalStore);

  const resetFormData = reactive({
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules, getContent } = useProjectMethods();
  const resetRules = createValidationRules(Object.keys(resetFormData).map((field) => ({ name: field })));
  const resetFormRules = getFormRules(resetRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(resetFormRules, resetFormData);

  const inputNewPassword = ():void => {
    if (v$.value.repeatNewPassword.$dirty) {
      const oldValue = resetFormData.repeatNewPassword;
      resetFormData.repeatNewPassword = '';
      resetFormData.repeatNewPassword = oldValue;
    }
  };

  const { closeModal, showAlert } = useLayoutStore();
  const showErrorAlert = ():void => {
    showAlert(alertsData.value?.invalidResetCode || defaultLocaleAlertsData.value?.invalidResetCode);
  };

  const isLockedAsyncButton = ref<boolean>(false);
  const { resetProfilePassword } = useCoreProfileApi();
  const resetPassword = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      const route = useRoute();
      await resetProfilePassword({ ...resetFormData, code: route.query.resetCode as string });
      showAlert(alertsData.value?.passwordChanged || defaultLocaleAlertsData.value?.passwordChanged);
      closeModal('resetPass');
    } catch (error:any) {
      if (error.response?.status === 422) {
        if (error.data?.error?.fields.code) showErrorAlert();
        else serverFormErrors.value = error.data?.error?.fields;
      } else showErrorAlert();
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss">
.form-join {
  display: grid;
  grid-row-gap: rem(16px);

  hr {
    margin: 0;
  }

  .btn-primary {
    --width: 100%;
    //--bg: var(--yellow-600);
    //--shadow: inset 0 3px 0 #B07B00;
  }
}
</style>
