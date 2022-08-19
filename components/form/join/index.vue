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
          :label="fieldsContent[field.name]?.label || ''"
          :name="field.name"
          :placeholder="fieldsContent[field.name]?.placeholder || ''"
          @blur="v$[field.name]?.$touch()"
          @focus="onFocus(field.name)"
          :hint="setError(field.name)"
        />
      </template>

      <component
        v-else
        :key="field.name"
        @blur="v$[field.name]?.$touch()"
        @focus="onFocus(field.name)"
        :is="fieldsTypeMap[field.name].component || 'form-input-text'"
        v-model:value="registrationFormData[field.name]"
        :type="field.name === 'nickname' ? 'hidden' : fieldsTypeMap[field.name].type || 'text'"
        :label="fieldsContent[field.name]?.label || ''"
        :name="field.name"
        :placeholder="fieldsContent[field.name]?.placeholder || ''"
        :options="selectOptions[field.name]"
        :isRequired="registrationFormRules[field.name]?.hasOwnProperty('required')"
        :hint="setError(field.name)"
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
      :label="fieldsContent[field.name]?.label ? fieldsContent[field.name]?.label === 'Send promos by Email' ? 'I agree to receive bonus & marketing emails' : fieldsContent[field.name]?.label : ''"
    >
    </form-input-checkbox>

    <button-base
      tagName="div"
      type="primary"
      size="md"
      :isDisabled="v$.$invalid || isLockedAsyncButton"
      @click="signUp"
    >Sign up</button-base>

    <button-text-sign @click="showModal('signIn')" />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';
  import { useGlobalStore } from '~/composables/useGlobalStore';

  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { setFormData } = useCoreMethods();
  const { showModal, closeModal } = useLayoutStore();
  const fieldsStore = useFieldsStore();
  const { fieldsContent, selectOptions, registrationFields } = storeToRefs(fieldsStore);

  const mainFields = registrationFields.value.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = registrationFields.value.filter((field) => groupFooterFields.includes(field.name));
  const registrationFormData = reactive(setFormData(registrationFields.value));
  if (registrationFormData.hasOwnProperty('nickname')) registrationFormData.nickname = 'undefined';
  if (registrationFormData.hasOwnProperty('currency')) registrationFormData.currency = 'BTC';
  if (registrationFormData.hasOwnProperty('country')) {
    const { initUserInfo, countries } = useGlobalStore();
    if (countries.find((country) => country.code === initUserInfo.country)) {
      registrationFormData.country = initUserInfo.country;
    }
  }

  const { getFormRules, createValidationRules } = useProjectMethods();
  const registrationRules = createValidationRules(registrationFields.value, true);
  const registrationFormRules = getFormRules(registrationRules);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(registrationFormRules, registrationFormData);

  const onFocus = (fieldName:string):void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const showPromoInput = ref<boolean>(false);

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    } if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
  };

  const { registration } = useProfileStore();
  const isLockedAsyncButton = ref<boolean>(false);

  const { getNicknameFromEmail } = useProjectMethods();
  const signUp = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    if (registrationFormData.hasOwnProperty('nickname')) {
      registrationFormData.nickname = getNicknameFromEmail(registrationFormData.email);
    }

    try {
      isLockedAsyncButton.value = true;
      await registration(registrationFormData);
      closeModal('register');
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
