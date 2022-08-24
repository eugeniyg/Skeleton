<template>
  <form class="form-sign-in">
    <form-input-text
      v-model:value="authorizationFormData.email"
      @blur="v$.email?.$touch()"
      @focus="focusField('email')"
      type="email"
      :is-required="true"
      :label="fieldsContent.email?.label || ''"
      name="email"
      :placeholder="fieldsContent.email?.placeholder || ''"
      :hint="setError('email')"
      @submit="login"
    />

    <form-input-password
      v-model:value="authorizationFormData.password"
      @blur="v$.password?.$touch()"
      @focus="focusField('password')"
      type="password"
      :is-required="true"
      :label="fieldsContent.password?.label || ''"
      name="password"
      :placeholder="fieldsContent.password?.placeholder || ''"
      :hint="setError('password')"
      @submit="login"
    />

    <atomic-hint v-if="loginError" variant="error" :message="validationMessages.login || ''" />

    <button-base
      type="primary"
      size="md"
      tagName="div"
      @click="login"
      :isDisabled="v$.$invalid || isLockedAsyncButton"
    >
      Sign in
    </button-base>

    <button-forgot-pass/>

    <button-text-join @click="showModal('register')"/>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { validationMessages, fieldsContent } = storeToRefs(globalStore);
  const { showModal, closeModal } = useLayoutStore();

  const authorizationFormData = reactive({ email: '', password: '' });
  const { getFormRules } = useProjectMethods();
  const authorizationRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
    password: [{ rule: 'required' }],
  };
  const authorizationFormRules = getFormRules(authorizationRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(authorizationFormRules, authorizationFormData);
  const loginError = ref<boolean>(false);

  const focusField = (fieldName:string):void => {
    loginError.value = false;
    onFocus(fieldName);
  };

  const { logIn } = useProfileStore();
  const isLockedAsyncButton = ref<boolean>(false);

  const login = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await logIn(authorizationFormData);
      closeModal('signIn');
    } catch (error) {
      if (error.response?.status === 401) {
        loginError.value = true;
      } else if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else if (error.response?.status === 403) {
        const { showAlert } = useLayoutStore();
        showAlert({
          title: 'Error',
          text: 'Sorry, but your account is blocked. Please, contact our support team for more information.',
          variant: 'error',
        });
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
