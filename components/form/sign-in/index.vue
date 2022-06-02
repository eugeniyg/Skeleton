<template>
  <form class="form-sign-in">
    <form-input-text
      v-model:value="authorizationFormData.email"
      @blur="v$.email.$touch()"
      @focus="loginError = false"
      type="text"
      :is-required="true"
      label="Email Address"
      name="email"
      placeholder="Enter your email"
      :hint="setError('email')"
    />

    <form-input-password
      v-model:value="authorizationFormData.password"
      @blur="v$.password.$touch()"
      @focus="loginError = false"
      type="password"
      :is-required="true"
      label="Enter your password"
      name="password"
      placeholder="Enter your password"
      :hint="setError('password')"
    />

    <atomic-hint v-if="loginError" variant="error" :message="validationMessages.login" />

    <button-base type="primary" size="md" @click="login">Sign up</button-base>

    <button-forgot-pass/>

    <button-text-join @click="showModal('register')"/>
  </form>
</template>

<script setup lang="ts">
  import useVuelidate from '@vuelidate/core';
  import { useGlobalMethods, useAuthApi } from '~/CORE';

  const props = defineProps({
    show: {
      type: Boolean,
      required: true,
    },
  });

  const { submitLoginData } = useAuthApi();
  const { setFormData } = useGlobalMethods();
  const { validationMessages } = useGlobalStore();
  const { showModal, closeModal } = useLayoutStore();
  const authorizationFields = [
    {
      name: 'email',
      description: 'Email',
      isRequired: true,
      validationRules: [{ rule: 'email', arguments: null }],
    },
    {
      name: 'password',
      description: 'Password',
      isRequired: true,
      validationRules: [],
    },
  ];

  const authorizationFormData = reactive(setFormData(authorizationFields));

  const { getFormRules } = useProjectMethods();
  const authorizationFormRules = getFormRules(authorizationFields);
  const serverFormErrors = ref<any>({});
  const loginError = ref<boolean>(false);
  const v$ = useVuelidate(authorizationFormRules, authorizationFormData, { $lazy: true });

  watch(() => props.show, (newValue:boolean) => {
    if (!newValue) {
      Object.keys(authorizationFormData).forEach((key) => {
        authorizationFormData[key] = '';
      });
      v$.value.$reset();
      serverFormErrors.value = {};
      loginError.value = false;
    }
  });

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    } if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
  };

  const { setToken } = useProfileStore();
  const login = async ():Promise<void> => {
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      const submitResult = await submitLoginData(authorizationFormData);
      setToken(submitResult);
      closeModal('signIn');
    } catch (error) {
      if (error.response?.status === 401) {
        loginError.value = true;
      } else if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
