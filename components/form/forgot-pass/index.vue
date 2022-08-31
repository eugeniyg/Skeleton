<template>
  <form class="form-forgot-pass">
    <form-input-text
      v-model:value="forgotFormData.email"
      @blur="v$.email?.$touch()"
      @focus="onFocus('email')"
      type="email"
      :is-required="true"
      :label="fieldsContent.email?.label || ''"
      name="email"
      :placeholder="fieldsContent.email?.placeholder || ''"
      :hint="setError('email')"
      @submit="sendEmail"
    />

    <button-base
      type="primary"
      size="md"
      tagName="div"
      :isDisabled="v$.$invalid || isLockedAsyncButton"
      @click="sendEmail"
    >
      {{ forgotContent?.forgotButton }}
    </button-base>

    <button-popup :buttonLabel="forgotContent?.registrationButton || ''" openModal="register" />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ForgotInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { fieldsContent, popupsData } = storeToRefs(globalStore);
  const forgotContent: ForgotInterface|undefined = popupsData.value?.forgot;

  const forgotFormData = reactive({ email: '' });
  const { getFormRules } = useProjectMethods();
  const forgotRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
  };
  const forgotFormRules = getFormRules(forgotRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(forgotFormRules, forgotFormData);

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
