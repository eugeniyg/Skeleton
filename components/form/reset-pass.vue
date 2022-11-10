<template>
  <form class="form-reset-pass">
    <form-input-password
      v-model:value="resetFormData.newPassword"
      type="password"
      name="newPassword"
      :label="fieldsContent?.newPassword?.label || ''"
      :placeholder="fieldsContent?.newPassword?.placeholder || ''"
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
      :label="fieldsContent?.repeatNewPassword?.label || ''"
      :placeholder="fieldsContent?.repeatNewPassword?.placeholder || ''"
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
      {{ resetContent?.resetButton }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ResetInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { fieldsContent, popupsData, alertsData } = storeToRefs(globalStore);
  const resetContent: ResetInterface|undefined = popupsData.value?.reset;

  const resetFormData = reactive({
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules } = useProjectMethods();
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
    showAlert(alertsData.value?.invalidResetCode);
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
      showAlert(alertsData.value?.passwordChanged);
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
