<template>
  <form class="form-sign-in">
    <form-input-text
      v-model:value="authorizationFormData.email"
      @blur="onBlur('email')"
      @focus="loginError = false"
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
      @blur="onBlur('password')"
      @focus="loginError = false"
      type="password"
      :is-required="true"
      :label="fieldsContent.password?.label || ''"
      name="password"
      :placeholder="fieldsContent.password?.placeholder || ''"
      :hint="setError('password')"
      @submit="login"
    />

    <atomic-hint v-if="loginError" variant="error" :message="validationMessages.login" />

    <button-base
      type="primary"
      size="md"
      tagName="div"
      @click="login"
      :isDisabled="v$.$invalid"
    >
      Sign in
    </button-base>

    <button-forgot-pass/>

    <button-text-join @click="showModal('register')"/>
  </form>
</template>

<script setup lang="ts">
  import useVuelidate from '@vuelidate/core';
  import { storeToRefs } from 'pinia';
  import { useGlobalMethods } from '~/CORE';

  const props = defineProps({
    show: {
      type: Boolean,
      required: true,
    },
  });

  const { setFormData } = useGlobalMethods();
  const globalStore = useGlobalStore();
  const { validationMessages, fieldsContent } = storeToRefs(globalStore);
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
  const authorizationFormRules = getFormRules(authorizationFields, true);
  const serverFormErrors = ref<any>({});
  const loginError = ref<boolean>(false);
  const v$ = useVuelidate(authorizationFormRules, authorizationFormData);

  const onBlur = (fieldName:string):void => {
    v$.value[fieldName]?.$touch();
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

  const { logIn } = useProfileStore();
  const login = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      await logIn(authorizationFormData);
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
