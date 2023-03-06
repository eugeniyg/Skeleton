<template>
  <div class="security-password">
    <div class="security-password__subtitle">{{ passwordContent?.label || defaultLocalePasswordContent?.label }}</div>

    <form class="form form-change">
      <div v-for="field in Object.keys(changeFormData)" :key="field" :class="`row row-${field}`">
        <form-input-password
          v-model:value="changeFormData[field]"
          type="password"
          :name="field"
          :label="getContent(fieldsContent, defaultLocaleFieldsContent, `${field}.label`) || ''"
          :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, `${field}.placeholder`) || ''"
          :is-required="true"
          :hint="setError(field)"
          @blur="v$[field]?.$touch()"
          @focus="onFocus(field)"
          @input="inputNewPassword(field)"
        />
      </div>

      <button-base
        type="primary"
        size="md"
        tagName="div"
        @click="onSubmit"
        :isDisabled="v$.$invalid || isLockedAsyncButton"
      >
        {{ passwordContent?.saveButton || defaultLocalePasswordContent?.saveButton }}
      </button-base>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const {
    fieldsContent,
    defaultLocaleFieldsContent,
    alertsData,
    defaultLocaleAlertsData,
  } = storeToRefs(globalStore);

  const passwordContent: Maybe<{label: string, saveButton:string}> = inject('passwordContent');
  const defaultLocalePasswordContent: Maybe<{label: string, saveButton:string}> = inject('defaultLocalePasswordContent');

  interface ChangeFormDataInterface extends Record<string, any>{
    currentPassword: string,
    newPassword: string,
    repeatNewPassword: string,
  }

  const changeFormData = reactive<ChangeFormDataInterface>({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const { getFormRules, createValidationRules, getContent } = useProjectMethods();
  const changeRules = createValidationRules(Object.keys(changeFormData).map((field) => ({ name: field })));
  const changeFormRules = getFormRules(changeRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(changeFormRules, changeFormData);

  const inputNewPassword = (fieldName:string):void => {
    if (fieldName === 'newPassword' && v$.value.repeatNewPassword.$dirty) {
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
      showAlert(alertsData.value?.passwordChanged || defaultLocaleAlertsData.value?.passwordChanged);
      clearForm();
    } catch (error:any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style lang="scss">
.security-password {
  .form-change {
    grid-template-areas:
      "old"
      "new"
      "reenter"
      "save";

    @include media(xs) {
      grid-template-areas:
      "old ."
      "new reenter"
      "save save";
    }
  }

  .row-currentPassword {
    grid-area: old;
  }

  .row-newPassword {
    grid-area: new;
  }

  .row-repeatNewPassword {
    grid-area: reenter;
  }

  .btn-primary {
    grid-area: save;
  }

  &__subtitle {
    @include font($heading-5);
    color: var(--white);
    margin-bottom: 24px;
  }
}
</style>
