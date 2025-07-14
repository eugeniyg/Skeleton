<template>
  <div class="password-block">
    <div class="password-block__subtitle">
      {{ securityContent?.password?.label || defaultLocaleSecurityContent?.password?.label }}
    </div>

    <form class="form form-change">
      <div v-for="field in Object.keys(changeFormData)" :key="field" :class="`row row-${field}`">
        <form-input-password
          v-model:value="changeFormData[field]"
          type="password"
          :name="field"
          :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field}.label`) || ''"
          :placeholder="
            getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field}.placeholder`) || ''
          "
          :is-required="true"
          :hint="setError(field)"
          @blur="v$[field]?.$touch()"
          @focus="onFocus(field)"
          @input="inputNewPassword(field)"
        />
      </div>

      <button-base
        v-if="securityContent || defaultLocaleSecurityContent"
        type="primary"
        size="md"
        tag-name="div"
        :is-disabled="v$.$invalid || isLockedAsyncButton"
        @click="onSubmit"
      >
        {{ securityContent?.password?.saveButton || defaultLocaleSecurityContent?.password?.saveButton }}
      </button-base>
    </form>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileSecurity } from '~/types';
  import { changeProfilePassword } from '@skeleton/api/profile';
  import { createValidationRules, getFormRules } from '@skeleton/helpers/formMethods';

  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings, alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const securityContent = ref<Maybe<IProfileSecurity>>(inject('securityContent'));
  const defaultLocaleSecurityContent = ref<Maybe<IProfileSecurity>>(inject('defaultLocaleSecurityContent'));

  interface IChangeFormData extends Record<string, any> {
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  }

  const changeFormData = reactive<IChangeFormData>({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const changeRules = createValidationRules(Object.keys(changeFormData).map(field => ({ name: field })));
  const changeFormRules = getFormRules(changeRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(changeFormRules, changeFormData);

  const inputNewPassword = (fieldName: string): void => {
    if (fieldName === 'newPassword' && v$.value.repeatNewPassword.$dirty) {
      const oldValue = changeFormData.repeatNewPassword;
      changeFormData.repeatNewPassword = '';
      changeFormData.repeatNewPassword = oldValue;
    }
  };

  const clearForm = (): void => {
    Object.keys(changeFormData).forEach(field => {
      changeFormData[field] = '';
    });
    v$.value.$reset();
  };

  const { showAlert } = useLayoutStore();
  const isLockedAsyncButton = ref<boolean>(false);
  const onSubmit = async (): Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await changeProfilePassword(changeFormData);
      showAlert(alertsData.value?.profile?.passwordChanged || defaultLocaleAlertsData.value?.profile?.passwordChanged);
      clearForm();
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/profile/password.scss" lang="scss" />
