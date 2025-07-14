<template>
  <form class="form-forgot-pass">
    <form-input-phone
      key="phone"
      v-model:value="forgotFormData.phone"
      :is-required="true"
      :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.phone.label') || ''"
      name="phone"
      :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.phone.placeholder') || ''"
      :hint="setError('phone')"
      @blur="v$.phone?.$touch()"
      @focus="onFocus('phone')"
      @submit="sendOtpRequest"
    />

    <button-base
      type="primary"
      size="md"
      tag-name="div"
      :is-disabled="v$.$invalid || isLockedAsyncButton"
      @click="sendOtpRequest"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton" />
      {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'sendOtpButton') }}
    </button-base>
  </form>
</template>

<script setup lang="ts">
  import type { IModalsContent } from '~/types';
  import { sendOtp } from '@skeleton/api/auth';
  import { getFormRules } from '@skeleton/helpers/formMethods';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['forgot']>;
    defaultLocaleData: Maybe<IModalsContent['forgot']>;
  }>();

  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings, globalComponentsContent, defaultLocaleGlobalComponentsContent } =
    storeToRefs(globalStore);

  const emit = defineEmits(['sendOtp']);
  const forgotFormData = reactive({ phone: '' });
  const forgotRules = {
    phone: [{ rule: 'required' }, { rule: 'phone' }],
  };
  const forgotFormRules = getFormRules(forgotRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(forgotFormRules, forgotFormData);

  const isLockedAsyncButton = ref<boolean>(false);

  const sendOtpRequest = async (): Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      isLockedAsyncButton.value = true;
      await sendOtp({ phone: forgotFormData.phone, reason: 'changingPass' });
      emit('sendOtp', forgotFormData);
    } catch (error: any) {
      if (error.data?.error?.code === 11005) {
        const limitError = getContent(
          globalComponentsContent.value,
          defaultLocaleGlobalComponentsContent.value,
          'phoneVerification.limitError'
        );
        serverFormErrors.value = { phone: [limitError] };
      } else {
        serverFormErrors.value = { phone: [error.data?.error?.message] };
      }
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>
