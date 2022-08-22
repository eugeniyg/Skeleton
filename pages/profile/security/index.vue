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
          @input="inputNewPassword"
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

  const fieldsStore = useFieldsStore();
  const { fieldsContent } = storeToRefs(fieldsStore);

  const changeFormData = reactive({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules } = useProjectMethods();
  const changeRules = createValidationRules(Object.keys(changeFormData).map((field) => ({ name: field })));
  const changeFormRules = getFormRules(changeRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(changeFormRules, changeFormData);

  const inputNewPassword = ():void => {
    if (v$.value.repeatNewPassword.$dirty) {
      const oldValue = changeFormData.repeatNewPassword;
      changeFormData.repeatNewPassword = '';
      changeFormData.repeatNewPassword = oldValue;
    }
  };

  const clearForm = ():void => {
    Object.keys(changeFormData).forEach((field) => { changeFormData[field] = ''; });
    v$.value.$reset();
  };

  const { showAlert } = useLayoutStore();
  const isLockedAsyncButton = ref<boolean>(false);
  const { changeProfilePassword } = useCoreProfileApi();
  const onSubmit = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await changeProfilePassword(changeFormData);
      showAlert({
        title: 'Success',
        text: 'You have successfully changed your password!',
        variant: 'done',
      });
      clearForm();
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
