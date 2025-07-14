<template>
  <form class="form-sign-in">
    <form-input-text
      v-if="props.loginType === 'email'"
      key="email"
      ref="inputEmailRef"
      v-model:value="authorizationFormData.login"
      type="email"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.label') || ''"
      name="login"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.placeholder') || ''"
      :hint="setError('login')"
      @blur="v$.login?.$touch()"
      @focus="focusField('login')"
      @submit="login"
    />

    <form-input-phone
      v-else
      key="phone"
      ref="inputPhoneRef"
      v-model:value="authorizationFormData.login"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.phone.label') || ''"
      name="login"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.phone.placeholder') || ''"
      :hint="setError('login')"
      @blur="v$.login?.$touch()"
      @focus="focusField('login')"
      @submit="login"
    />

    <form-input-password
      v-model:value="authorizationFormData.password"
      type="password"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.password.label') || ''"
      name="password"
      :placeholder="
        getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.password.placeholder') || ''
      "
      :hint="setError('password')"
      @blur="v$.password?.$touch()"
      @focus="focusField('password')"
      @submit="login"
    />

    <atomic-hint v-if="loginError || socialAuthEmailError" variant="error" :message="hintErrorMessage" />

    <button-base
      type="primary"
      size="md"
      tag-name="div"
      :is-disabled="v$.$invalid || isLockedAsyncButton"
      @click="login"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton" />
      {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'loginButton') }}
    </button-base>

    <button-popup
      class="btn-forgot"
      :button-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'forgotButton')"
      modal="forgot-pass"
    />

    <atomic-socials type="login" />

    <button-popup
      :button-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'registrationButton')"
      modal="sign-up"
    />
  </form>
</template>

<script setup lang="ts">
  import type { IModalsContent } from '~/types';
  import { getFormRules } from '@skeleton/helpers/formMethods';

  const props = defineProps<{
    loginType: 'email' | 'phone';
    count: number;
    currentLocaleData: Maybe<IModalsContent['signIn']>;
    defaultLocaleData: Maybe<IModalsContent['signIn']>;
  }>();

  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings, alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { closeModal } = useModalStore();

  const profileStore = useProfileStore();
  const { socialAuthEmailError } = storeToRefs(profileStore);
  const { logIn } = profileStore;
  const isLockedAsyncButton = ref<boolean>(false);

  const hintErrorMessage = computed(() => {
    const emailVerificationError = getContent(
      props.currentLocaleData,
      props.defaultLocaleData,
      'emailVerificationError'
    );
    const loginError = getContent(fieldsSettings.value, defaultLocaleFieldsSettings.value, 'validationMessages.login');

    if (!emailVerificationError && !loginError) return '';
    if (socialAuthEmailError.value) return emailVerificationError;
    return loginError;
  });

  const authorizationFormData = reactive({
    login: '',
    password: '',
  });
  const authorizationRules = {
    password: [{ rule: 'required' }],
    login: [{ rule: 'required' }, { rule: props.loginType || 'email' }],
  };
  const authorizationFormRules = getFormRules(authorizationRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(authorizationFormRules, authorizationFormData);
  const loginError = ref<boolean>(false);

  const focusField = (fieldName: string): void => {
    loginError.value = false;
    onFocus(fieldName);
  };

  const login = async (): Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await logIn(authorizationFormData);
      closeModal('sign-in');
    } catch (error: any) {
      if (error.response?.status === 401) {
        loginError.value = true;
      } else if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else if (error.response?.status === 403) {
        const { showAlert } = useLayoutStore();
        showAlert(alertsData.value?.profile?.accountBlocked || defaultLocaleAlertsData.value?.profile?.accountBlocked);
      } else {
        throw error;
      }
    } finally {
      isLockedAsyncButton.value = false;
    }
  };

  const inputEmailRef = ref();
  const inputPhoneRef = ref();

  onMounted(() => {
    nextTick(() => {
      if (props.loginType === 'email' && props.count < 1) {
        inputEmailRef.value?.focusField();
      }
    });
  });

  onBeforeUnmount(() => {
    socialAuthEmailError.value = false;
  });
</script>

<style src="~/assets/styles/components/form/sign-in.scss" lang="scss" />
