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
        :is="fieldsTypeMap[field.name]?.component || 'form-input-text'"
        v-model:value="registrationFormData[field.name]"
        :type="hiddenFields.includes(field.name) ? 'hidden' : fieldsTypeMap[field.name]?.type || 'text'"
        :inputmode="fieldsTypeMap[field.name]?.inputmode"
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
      :isDisabled="v$.$invalid || isLockedAsyncButton"
      @click="signUp"
    >
      <atomic-spinner :is-shown="isLockedAsyncButton"/>
      {{ getContent(popupsData, defaultLocalePopupsData, 'registration.registrationButton') }}
    </button-base>

    <button-popup
      :buttonLabel="getContent(popupsData, defaultLocalePopupsData, 'registration.loginButton')"
      openModal="signIn"
    />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IField } from '@skeleton/core/types';
  import fieldsTypeMap from '@skeleton/maps/fieldsTypeMap.json';

  const props = defineProps<{
    registrationFields: IField[]
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

  const mainFields = props.registrationFields.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = props.registrationFields.filter((field) => groupFooterFields.includes(field.name));
  const registrationFormData = reactive(setFormData(props.registrationFields));
  const geoCountry = countries.value.find(country => country.code === headerCountry.value);
  if (registrationFormData.hasOwnProperty('nickname')) registrationFormData.nickname = 'undefined';
  if (registrationFormData.hasOwnProperty('currency')) registrationFormData.currency = geoCountry?.currency || 'BTC';
  if (registrationFormData.hasOwnProperty('locale')) registrationFormData.locale = currentLocale.value?.code;
  if (registrationFormData.hasOwnProperty('country') && !registrationFormData.country && geoCountry) {
    registrationFormData.country = geoCountry.code;
  }

  const getCheckboxLabel = (fieldName: string):string|undefined => {
    if (fieldName === 'receiveEmailPromo') return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.agreeEmailLabel');
    if (fieldName === 'receiveSmsPromo') return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.agreeSmsLabel');
    return getContent(fieldsSettings.value, defaultLocaleFieldsSettings.value, `fieldsControls.${fieldName}.label`) || '';
  };

  const { getFormRules, createValidationRules } = useProjectMethods();
  const registrationRules = createValidationRules(props.registrationFields, true);
  const registrationFormRules = getFormRules(registrationRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(registrationFormRules, registrationFormData);

  const showPromoInput = ref<boolean>(false);

  const { registration } = useProfileStore();
  const isLockedAsyncButton = ref<boolean>(false);

  const handleInput = (fieldName:string):void => {
    if (fieldName === 'password' && v$.value.password_confirmation?.$dirty) {
      const oldValue = registrationFormData.password_confirmation;
      registrationFormData.password_confirmation = '';
      registrationFormData.password_confirmation = oldValue;
    }
  };

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

    try {
      isLockedAsyncButton.value = true;
      await registration(registrationFormData);
      if (affiliateTag) localStorage.removeItem('affiliateTag');
      await openWalletModal('deposit')
      closeModal('register');
    } catch (error:any) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    } finally {
      isLockedAsyncButton.value = false;
    }
  };
</script>

<style src="~/assets/styles/components/form/join.scss" lang="scss" />

