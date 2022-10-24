<template>
  <form class="form-sign-in">
    <form-input-text
      v-model:value="authorizationFormData.email"
      @blur="v$.email?.$touch()"
      @focus="focusField('email')"
      type="email"
      :is-required="true"
      :label="fieldsContent?.email?.label || ''"
      name="email"
      :placeholder="fieldsContent?.email?.placeholder || ''"
      :hint="setError('email')"
      @submit="login"
    />

    <form-input-password
      v-model:value="authorizationFormData.password"
      @blur="v$.password?.$touch()"
      @focus="focusField('password')"
      type="password"
      :is-required="true"
      :label="fieldsContent?.password?.label || ''"
      name="password"
      :placeholder="fieldsContent?.password?.placeholder || ''"
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
      <atomic-spinner :is-shown="isLockedAsyncButton"/>
      {{ loginContent?.loginButton }}
    </button-base>

    <button-popup :buttonLabel="loginContent?.forgotButton" openModal="forgotPass"/>

    <button-popup :buttonLabel="loginContent?.registrationButton" openModal="register" />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { LoginInterface } from '~/types';

  const globalStore = useGlobalStore();
  const {
    validationMessages, fieldsContent, popupsData, alertsData,
  } = storeToRefs(globalStore);
  const { closeModal } = useLayoutStore();
  const loginContent: LoginInterface|undefined = popupsData.value?.login;

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
        showAlert(alertsData.value?.accountBlocked);
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss">
.form-sign-in {
  display: grid;
  grid-row-gap: rem(16px);

  hr {
    margin: 0;
  }

  .btn-primary {
    --width: 100% !important;

    &.size-md {
      --padding: #{rem(11px) rem(24px)};
    }
  }
}
</style>
