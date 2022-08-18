<template>
  <form class="form-reset-pass">
    <form-input-password
      v-model:value="resetFormData.newPassword"
      type="password"
      name="newPassword"
      :label="fieldsContent.newPassword?.label || ''"
      :placeholder="fieldsContent.newPassword?.placeholder || ''"
      :is-required="true"
      :hint="setError('newPassword')"
      @blur="v$.newPassword?.$touch()"
      @focus="onFocus('newPassword')"
    />

    <form-input-password
      v-model:value="resetFormData.repeatNewPassword"
      type="password"
      name="repeatNewPassword"
      :label="fieldsContent.repeatNewPassword?.label || ''"
      :placeholder="fieldsContent.repeatNewPassword?.placeholder || ''"
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
      Confirm
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';

  const fieldsStore = useFieldsStore();
  const { fieldsContent } = storeToRefs(fieldsStore);

  const resetFormData = reactive({
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules } = useProjectMethods();
  const resetRules = createValidationRules(Object.keys(resetFormData).map((field) => ({ name: field })));
  const resetFormRules = getFormRules(resetRules);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(resetFormRules, resetFormData);

  const onFocus = (fieldName:string):void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    } if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
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
      await resetProfilePassword({ ...resetFormData, code: route.query.resetCode });
      const { closeModal, showAlert } = useLayoutStore();
      showAlert({
        title: 'Success',
        text: 'You have successfully changed your password.',
        variant: 'done',
      });
      closeModal('resetPass');
    } catch (error) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
