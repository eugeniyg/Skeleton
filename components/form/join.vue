<template>
  <form class="form-join">
    <template v-for="field in mainFields">
      <template v-if="field.name === 'bonusCode'">
        <button-ref-promo :key="field.name + 'Toggle'" @show-promo-input="showPromoInput = true"/>

        <form-input-text
          v-show="showPromoInput"
          v-model:value="registrationFormData[field.name]"
          :key="field.name"
          type="text"
          :isRequired="registrationFormRules[field.name]?.hasOwnProperty('required')"
          :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || ''"
          :name="field.name"
          :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.placeholder`) || ''"
          @blur="v$[field.name]?.$touch()"
          @focus="onFocus(field.name)"
          :hint="setError(field.name)"
          :class="field.name"
        />
      </template>

      <component
        v-else
        :key="field.name"
        @blur="v$[field.name]?.$touch()"
        @focus="onFocus(field.name)"
        :is="fieldsMap[field.name]?.component || 'form-input-text'"
        v-model:value="registrationFormData[field.name]"
        :type="hiddenFields.includes(field.name) ? 'hidden' : fieldsMap[field.name]?.type || 'text'"
        :inputmode="fieldsMap[field.name]?.inputmode"
        :is-fit-content="fieldsMap[field.name]?.isFitContent"
        :enable-sort="fieldsMap[field.name]?.enableSort"
        :search-by="fieldsMap[field.name]?.searchBy"
        :label="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || ''"
        :name="field.name"
        :placeholder="getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.placeholder`) || ''"
        :options="selectOptions[field.name]"
        :isRequired="registrationFormRules[field.name]?.hasOwnProperty('required')"
        :hint="setError(field.name)"
        :class="field.name"
        @input="handleInput(field.name)"
      />
    </template>

    <atomic-divider/>

    <form-input-checkbox
      v-for="field in footerFields"
      v-model:value="registrationFormData[field.name]"
      :key="field.name"
      :name="field.name"
      @change="v$[field.name]?.$touch()"
      :isError="setError(field.name)"
      :isRequired="registrationFormRules[field.name]?.hasOwnProperty('required')"
      :label="getCheckboxLabel(field.name)"
    >
    </form-input-checkbox>

    <button-base
      tagName="div"
      type="primary"
      size="md"
      :isDisabled="sendButtonDisabled"
      @click="signUp"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton" />
      {{ getContent(popupsData, defaultLocalePopupsData, 'registration.registrationButton') }}
    </button-base>
    
    <atomic-socials type="registration" />

    <button-popup
      :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'registration.loginButton')"
      openModal="signIn"
    />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {IField, RegistrationType} from '@skeleton/core/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';

  const fieldsMap: Record<string, any> = fieldsTypeMap;

  const props = defineProps<{
    registrationFields: IField[];
    registrationType: RegistrationType;
  }>();

  const hiddenFields = ['nickname', 'locale'];
  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { setFormData } = useProjectMethods();
  const { closeModal, openWalletModal } = useLayoutStore();
  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const globalStore = useGlobalStore();
  const {
    countries,
    fieldsSettings,
    defaultLocaleFieldsSettings,
    popupsData,
    defaultLocalePopupsData,
    headerCountry,
    currentLocale
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const fieldsListByRegistrationType = computed(() => {
    if (['email', 'phone'].includes(props.registrationType)) {
      const clearFields = props.registrationFields.filter(field => field.name !== props.registrationType);
      return [
        {
          id: -1,
          name: props.registrationType,
          description: props.registrationType,
          editable: true,
          isRequired: true,
          position: 0
        },
        ...clearFields
      ]
    }
    return props.registrationFields;
  })

  const mainFields = fieldsListByRegistrationType.value.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = fieldsListByRegistrationType.value.filter((field) => groupFooterFields.includes(field.name));

  const getFields = (): IField[] => {
    const geoCountry = countries.value.find(country => country.code === headerCountry.value);

    return fieldsListByRegistrationType.value.map((field) => {
      if (field.name === 'nickname') return { ...field, value: 'undefined' };
      else if (field.name === 'currency') return { ...field, value: geoCountry?.currency || 'BTC' };
      else if (field.name === 'locale') return { ...field, value: currentLocale.value?.code };
      else if (field.name === 'country' && !field.value && geoCountry) return { ...field, value: geoCountry.code };
      else if (field.name === 'receiveEmailPromo') return {
        ...field,
        value: popupsData.value?.registration?.agreeEmailChecked ? 1 : 0
      };
      else if (field.name === 'receiveSmsPromo') return {
        ...field,
        value: popupsData.value?.registration?.agreeSmsChecked ? 1 : 0
      };
      else if (field.name === 'agreements') return {
        ...field,
        value: popupsData.value?.registration?.agreementsChecked ? 1 : 0
      };
      else return field;
    });
  }
  const registrationFormData = reactive(setFormData(getFields()));

  const getCheckboxLabel = (fieldName: string):string|undefined => {
    if (fieldName === 'receiveEmailPromo') return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.agreeEmailLabel');
    if (fieldName === 'receiveSmsPromo') return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.agreeSmsLabel');
    return getContent(fieldsSettings.value, defaultLocaleFieldsSettings.value, `fieldsControls.${fieldName}.label`) || '';
  };

  const { getFormRules, createValidationRules } = useProjectMethods();
  const registrationRules = createValidationRules(fieldsListByRegistrationType.value, true);
  const registrationFormRules = getFormRules(registrationRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(registrationFormRules, registrationFormData);

  const showPromoInput = ref<boolean>(false);
  const isLockedAsyncButton = ref<boolean>(false);

  const handleInput = (fieldName:string):void => {
    if (fieldName === 'password' && v$.value.password_confirmation?.$dirty) {
      const oldValue = registrationFormData.password_confirmation;
      registrationFormData.password_confirmation = '';
      registrationFormData.password_confirmation = oldValue;
    }
  };

  const setServerErrors = (serverErrors: Record<string, any>):void => {
    serverFormErrors.value = serverErrors;
  };
  defineExpose({ setServerErrors });

  const sendButtonDisabled = computed(() => {
    const hasServerError = Object.values(serverFormErrors.value).some(errorValue => errorValue);
    return v$.value.$invalid || hasServerError || isLockedAsyncButton.value;
  })

  const handlePhoneRegistration = async (): Promise<void> => {
    try {
      const { sendOtp } = useCoreAuthApi();
      await sendOtp({ phone: registrationFormData.phone, reason: 'registration' });
      emit('showVerification', registrationFormData);
    } catch (error:any) {
      if (error.data?.error?.code === 11005) {
        const limitError = getContent(popupsData.value, defaultLocalePopupsData.value, 'phoneVerification.limitError');
        serverFormErrors.value = { phone: [limitError] };
      } else {
        serverFormErrors.value = { phone: [error.data?.error?.message] };
      }
    }
  }

  const handleCommonRegistration = async (): Promise<void> => {
    try {
      useEvent('analyticsEvent', { event: 'registrationSubmit' });
      const { registration } = useProfileStore();
      await registration(registrationFormData);
    } catch (error:any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    }
  }

  const emit = defineEmits(['showVerification']);
  const { getNicknameFromEmail } = useProjectMethods();
  const signUp = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    if (registrationFormData.hasOwnProperty('nickname')) {
      registrationFormData.nickname = getNicknameFromEmail(registrationFormData.email);
    }

    const affiliateTag = localStorage.getItem('affiliateTag');
    if (affiliateTag) registrationFormData.affiliateTag = affiliateTag;

    isLockedAsyncButton.value = true;
    if (props.registrationType === 'phone') {
      await handlePhoneRegistration();
    } else {
      await handleCommonRegistration();
    }
    isLockedAsyncButton.value = false;
  };
</script>

<style src="~/assets/styles/components/form/join.scss" lang="scss" />

