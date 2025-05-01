<template>
  <form class="form-join">
    <template v-for="field in mainFields">
      <template v-if="field.name === 'bonusCode'">
        <button-ref-promo :key="field.name + 'Toggle'" @show-promo-input="showPromoInput = true" />

        <form-input-text
          v-show="showPromoInput"
          :key="field.name"
          v-model:value="registrationFormData[field.name]"
          type="text"
          :is-required="registrationFormRules[field.name]?.hasOwnProperty('required')"
          :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || ''"
          :name="field.name"
          :placeholder="
            getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.placeholder`) || ''
          "
          :hint="setError(field.name)"
          :class="field.name"
          @blur="v$[field.name]?.$touch()"
          @focus="onFocus(field.name)"
        />
      </template>

      <component
        :is="getFieldComponent(field.name)"
        v-else
        :key="field.name"
        v-model:value="registrationFormData[field.name]"
        :type="hiddenFields.includes(field.name) ? 'hidden' : fieldsMap[field.name]?.type || 'text'"
        :inputmode="fieldsMap[field.name]?.inputmode"
        :is-fit-content="fieldsMap[field.name]?.isFitContent"
        :enable-sort="fieldsMap[field.name]?.enableSort"
        :search-by="fieldsMap[field.name]?.searchBy"
        :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || ''"
        :name="field.name"
        :placeholder="
          getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.placeholder`) || ''
        "
        :options="selectOptions[field.name]"
        :is-required="registrationFormRules[field.name]?.hasOwnProperty('required')"
        :hint="setError(field.name)"
        :class="field.name"
        @blur="v$[field.name]?.$touch()"
        @focus="onFocus(field.name)"
        @input="handleInput(field.name)"
      />
    </template>

    <atomic-divider />

    <form-input-checkbox
      v-for="field in footerFields"
      :key="field.name"
      v-model:value="registrationFormData[field.name]"
      :name="field.name"
      :is-error="setError(field.name)"
      :is-required="registrationFormRules[field.name]?.hasOwnProperty('required')"
      :label="getCheckboxLabel(field.name)"
      @change="v$[field.name]?.$touch()"
    />

    <button-base tag-name="div" type="primary" size="md" :is-disabled="sendButtonDisabled" @click="signUp">
      <atomic-spinner :is-shown="isLockedAsyncButton" />
      {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'registrationButton') }}
    </button-base>

    <atomic-socials type="registration" />

    <button-popup
      :button-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'loginButton')"
      modal="sign-in"
    />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IField } from '@skeleton/core/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';
  import type { IModalsContent } from '~/types';

  const fieldsMap: Record<string, any> = fieldsTypeMap;

  const props = defineProps<{
    registrationFields: IField[];
    currentLocaleData: Maybe<IModalsContent['registration']>;
    defaultLocaleData: Maybe<IModalsContent['registration']>;
    selectedTab: 'email'| 'phone';
  }>();

  const { setFormData, getContent, getFormRules, createValidationRules, getNicknameFromEmail } = useProjectMethods();
  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const globalStore = useGlobalStore();
  const {
    countries,
    fieldsSettings,
    defaultLocaleFieldsSettings,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    headerCountry,
    currentLocale,
  } = storeToRefs(globalStore);

  const geoCountry = countries.value.find(country => country.code === headerCountry.value);
  const hiddenFields = computed(() => {
    const checkFields = ['country', 'currency', 'nickname'];
    const hiddenFieldsName = props.registrationFields
      .filter(field => {
        if (field.name === 'country' && !geoCountry) return false;
        if (field.name === 'currency' && !geoCountry && field.isRequired) return false;
        return checkFields.includes(field.name) && !field.isVisible;
      })
      .map(field => field.name);
    return ['locale', ...hiddenFieldsName];
  });
  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const hideCheckboxes = (fieldName: string): boolean => {
    const hideReceiveSmsPromo = props.selectedTab === 'email' && fieldName === 'receiveSmsPromo';
    const hideReceiveEmailPromo = props.selectedTab === 'phone' && fieldName === 'receiveEmailPromo';
    return !(hideReceiveSmsPromo || hideReceiveEmailPromo);
  };

  const fieldsListByRegistrationType = computed(() => {
    if (['email', 'phone'].includes(props.selectedTab)) {
      const clearFields = props.registrationFields.filter(field => {
        return field.name !== props.selectedTab && hideCheckboxes(field.name);
      });

      return [
        {
          id: -1,
          name: props.selectedTab,
          description: props.selectedTab,
          editable: true,
          isRequired: true,
          position: 0,
        },
        ...clearFields,
      ];
    }
    return props.registrationFields;
  });

  const mainFields = fieldsListByRegistrationType.value.filter(field => !groupFooterFields.includes(field.name));
  const footerFields = fieldsListByRegistrationType.value.filter(field => groupFooterFields.includes(field.name));

  const getFields = (): IField[] => {
    return fieldsListByRegistrationType.value.map(field => {
      if (field.name === 'nickname' && hiddenFields.value.includes('nickname')) return { ...field, value: 'undefined' };
      else if (field.name === 'currency') return { ...field, value: geoCountry?.currency };
      else if (field.name === 'locale') return { ...field, value: currentLocale.value?.code };
      else if (field.name === 'country' && !field.value && geoCountry) return { ...field, value: geoCountry.code };
      else if (field.name === 'receiveEmailPromo')
        return {
          ...field,
          value: props.currentLocaleData?.agreeEmailChecked ? 1 : 0,
        };
      else if (field.name === 'receiveSmsPromo')
        return {
          ...field,
          value: props.currentLocaleData?.agreeSmsChecked ? 1 : 0,
        };
      else if (field.name === 'agreements')
        return {
          ...field,
          value: props.currentLocaleData?.agreementsChecked ? 1 : 0,
        };
      else return field;
    });
  };
  const registrationFormData = reactive(setFormData(getFields()));

  const getCheckboxLabel = (fieldName: string): string | undefined => {
    if (fieldName === 'receiveEmailPromo')
      return getContent(props.currentLocaleData, props.defaultLocaleData, 'agreeEmailLabel');
    if (fieldName === 'receiveSmsPromo')
      return getContent(props.currentLocaleData, props.defaultLocaleData, 'agreeSmsLabel');
    return (
      getContent(fieldsSettings.value, defaultLocaleFieldsSettings.value, `fieldsControls.${fieldName}.label`) || ''
    );
  };

  const registrationRules = createValidationRules(fieldsListByRegistrationType.value, true);
  const registrationFormRules = getFormRules(registrationRules);
  const { serverFormErrors, v$, onFocus, setError } = useFormValidation(registrationFormRules, registrationFormData);

  const showPromoInput = ref<boolean>(false);
  const isLockedAsyncButton = ref<boolean>(false);

  const handleInput = (fieldName: string): void => {
    if (fieldName === 'password' && v$.value.password_confirmation?.$dirty) {
      const oldValue = registrationFormData.password_confirmation;
      registrationFormData.password_confirmation = '';
      registrationFormData.password_confirmation = oldValue;
    }
  };

  const setServerErrors = (serverErrors: Record<string, any>): void => {
    serverFormErrors.value = serverErrors;
  };
  defineExpose({ setServerErrors });

  const sendButtonDisabled = computed(() => {
    const hasServerError = Object.values(serverFormErrors.value).some(errorValue => errorValue);
    return v$.value.$invalid || hasServerError || isLockedAsyncButton.value;
  });

  const handlePhoneRegistration = async (): Promise<void> => {
    try {
      const { sendOtp } = useCoreAuthApi();
      await sendOtp({ phone: registrationFormData.phone, reason: 'registration' });
      emit('showVerification', registrationFormData);
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
    }
  };

  const handleCommonRegistration = async (): Promise<void> => {
    try {
      useEvent('analyticsEvent', { event: 'registrationSubmit' });
      const { registration } = useProfileStore();
      await registration(registrationFormData);
    } catch (error: any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    }
  };

  const emit = defineEmits(['showVerification']);
  const signUp = async (): Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    if (registrationFormData.hasOwnProperty('nickname') && hiddenFields.value.includes('nickname')) {
      registrationFormData.nickname = registrationFormData.email
        ? getNicknameFromEmail(registrationFormData.email)
        : undefined;
    }

    isLockedAsyncButton.value = true;
    if (props.selectedTab === 'phone') {
      await handlePhoneRegistration();
    } else {
      await handleCommonRegistration();
    }
    isLockedAsyncButton.value = false;
  };

  const getFieldComponent = (fieldName: string): string => {
    if (hiddenFields.value.includes(fieldName)) return 'form-input-text';
    return fieldsMap[fieldName]?.component || 'form-input-text';
  };
</script>

<style src="~/assets/styles/components/form/join.scss" lang="scss" />
