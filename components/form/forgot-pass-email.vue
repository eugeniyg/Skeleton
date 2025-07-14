<template>
  <form class="form-forgot-pass">
    <form-input-text
      v-model:value="forgotFormData.email"
      type="email"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.label') || ''"
      name="email"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.email.placeholder') || ''"
      :hint="setError('email')"
      @blur="v$.email?.$touch()"
      @focus="onFocus('email')"
      @submit="sendEmail"
    />

    <button-base
      type="primary"
      size="md"
      tag-name="div"
      :is-disabled="v$.$invalid || isLockedAsyncButton"
      @click="sendEmail"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton" />
      {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'forgotButton') }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['forgot']>;
    defaultLocaleData: Maybe<IModalsContent['forgot']>;
  }>();

  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings, alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const forgotFormData = reactive({ email: '' });
  const { getFormRules, getContent } = useProjectMethods();
  const forgotRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
  };
  const forgotFormRules = getFormRules(forgotRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(forgotFormRules, forgotFormData);

  const { forgotProfilePassword } = useCoreProfileApi();
  const isLockedAsyncButton = ref<boolean>(false);

  const sendEmail = async (): Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await forgotProfilePassword(forgotFormData);
      const { showAlert } = useLayoutStore();
      const { closeModal } = useModalStore();
      showAlert(alertsData.value?.profile?.sentResetLink || defaultLocaleAlertsData.value?.profile?.sentResetLink);
      closeModal('forgot-pass');
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>
