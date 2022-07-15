<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">Security & Verification</h1>
    </div>

    <hr/>

    <form class="form form-change">
      <div v-for="field in Object.keys(changeFormData)" :key="field" :class="`row row-${field}`">
        <form-input-password
          v-model:value="changeFormData[field]"
          type="password"
          :name="field"
          :label="fieldsContent[field]?.label || ''"
          :placeholder="fieldsContent[field]?.placeholder || ''"
          :is-required="true"
          :hint="setError(field)"
          @blur="v$[field]?.$touch()"
          @focus="onFocus(field)"
        />
      </div>

      <button-base
        type="primary"
        size="md"
        tagName="div"
        @click="onSubmit"
        :isDisabled="v$.$invalid || isLockedAsyncButton"
      >
        Save changes
      </button-base>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';
  import { useProfileApi } from '~/CORE';

  const globalStore = useGlobalStore();
  const { fieldsContent } = storeToRefs(globalStore);

  const changeFormData = reactive({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules } = useProjectMethods();
  const changeRules = createValidationRules(Object.keys(changeFormData).map((field) => ({ name: field })));
  const changeFormRules = getFormRules(changeRules);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(changeFormRules, changeFormData);

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
  const { changeProfilePassword } = useProfileApi();
  const onSubmit = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await changeProfilePassword(changeFormData);
      // await registration(registrationFormData);
      // closeModal('register');
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
