<template>
  <form class="form-sign-in">
    <form-input-text
      v-model:value="authorizationFormData.login"
      @blur="v$.login?.$touch()"
      @focus="focusField('login')"
      type="email"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.label') || ''"
      name="login"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.placeholder') || ''"
      :hint="setError('login')"
      @submit="login"
    />

    <form-input-password
      v-model:value="authorizationFormData.password"
      @blur="v$.password?.$touch()"
      @focus="focusField('password')"
      type="password"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.password.label') || ''"
      name="password"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.password.placeholder') || ''"
      :hint="setError('password')"
      @submit="login"
    />

    <atomic-hint
      v-if="loginError"
      variant="error"
      :message="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'validationMessages.login') || ''"
    />

    <button-base
      type="primary"
      size="md"
      tagName="div"
      @click="login"
      :isDisabled="v$.$invalid || isLockedAsyncButton"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton"/>
      {{ getContent(popupsData, defaultLocalePopupsData, 'login.loginButton') }}
    </button-base>

    <button-popup
      class="btn-forgot"
      :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'login.forgotButton')"
      openModal="forgotPass"
    />
    
    <atomic-socials/>

    <button-popup
      :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'login.registrationButton')"
      openModal="register"
    />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const {
    fieldsSettings,
    defaultLocaleFieldsSettings,
    popupsData,
    defaultLocalePopupsData,
    alertsData,
    defaultLocaleAlertsData,
  } = storeToRefs(globalStore);
  const { closeModal } = useLayoutStore();

  const authorizationFormData = reactive({ login: '', password: '' });
  const { getFormRules, getContent } = useProjectMethods();
  const authorizationRules = {
    login: [{ rule: 'required' }, { rule: 'email' }],
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
    } catch (error:any) {
      if (error.response?.status === 401) {
        loginError.value = true;
      } else if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else if (error.response?.status === 403) {
        const { showAlert } = useLayoutStore();
        showAlert(alertsData.value?.profile?.accountBlocked || defaultLocaleAlertsData.value?.profile?.accountBlocked);
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/form/sign-in.scss" lang="scss" />

