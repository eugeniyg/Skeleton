<template>
  <form class="form-forgot-pass">
    <form-input-text
      v-model:value="forgotFormData.email"
      @blur="v$.email?.$touch()"
      @focus="onFocus"
      type="email"
      :is-required="true"
      :label="fieldsContent.email?.label || ''"
      name="email"
      :placeholder="fieldsContent.email?.placeholder || ''"
      :hint="setError()"
      @submit="sendEmail"
    />

    <button-base
      type="primary"
      size="md"
      tagName="div"
      :isDisabled="v$.$invalid || isLockedAsyncButton"
      @click="sendEmail"
    >
      Reset password
    </button-base>

    <button-text-join />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';

  const fieldsStore = useFieldsStore();
  const { fieldsContent } = storeToRefs(fieldsStore);

  const forgotFormData = reactive({ email: '' });
  const { getFormRules } = useProjectMethods();
  const forgotRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
  };
  const forgotFormRules = getFormRules(forgotRules);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(forgotFormRules, forgotFormData);

  const onFocus = ():void => {
    if (serverFormErrors.value.email) {
      serverFormErrors.value.email = undefined;
    }
  };

  const setError = ():undefined|{ variant: string, message: any } => {
    if (v$.value.email?.$error) {
      return { variant: 'error', message: v$.value.email.$errors[0].$message };
    } if (serverFormErrors.value.email) {
      return { variant: 'error', message: serverFormErrors.value.email[0] };
    }
    return undefined;
  };

  const { forgotProfilePassword } = useCoreProfileApi();
  const isLockedAsyncButton = ref<boolean>(false);

  const sendEmail = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await forgotProfilePassword(forgotFormData);
      const { closeModal, showAlert } = useLayoutStore();
      showAlert({
        title: 'Success',
        text: 'A password reset link was sent. Click the link in the email to create a new password.',
        variant: 'done',
      });
      closeModal('forgotPass');
    } catch (error) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss" src="./style.scss" />
