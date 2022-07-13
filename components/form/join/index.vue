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
        :type="fieldsTypeMap[field.name].type || 'text'"
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
  import { useGlobalMethods } from '~/CORE/index';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';

  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { setFormData } = useGlobalMethods();
  const { showModal, closeModal } = useLayoutStore();
  const profileStore = useProfileStore();
  const { registrationFields } = storeToRefs(profileStore);
  const globalStore = useGlobalStore();
  const { fieldsContent } = storeToRefs(globalStore);

  const mainFields = registrationFields.value.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = registrationFields.value.filter((field) => groupFooterFields.includes(field.name));
  const registrationFormData = reactive(setFormData(registrationFields.value));
  if (registrationFormData.hasOwnProperty('currency')) registrationFormData.currency = 'BTC';
  if (registrationFormData.hasOwnProperty('country')) registrationFormData.country = 'NL';

  const { getFormRules } = useProjectMethods();
  const registrationRules = {};
  registrationFields.value.forEach((field) => {
    if (field.isRequired) registrationRules[field.name] = [{ rule: 'required' }];
    if (fieldsTypeMap[field.name].validation?.length) {
      registrationRules[field.name] = [...registrationRules[field.name], ...fieldsTypeMap[field.name].validation];
    }
  });
  const registrationFormRules = getFormRules(registrationRules);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(registrationFormRules, registrationFormData);

  const onFocus = (fieldName:string):void => {
    if (serverFormErrors.value[fieldName]) {
      serverFormErrors.value[fieldName] = undefined;
    }
  };

  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const showPromoInput = ref<boolean>(false);

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    } if (serverFormErrors.value[fieldName]) {
      return { variant: 'error', message: serverFormErrors.value[fieldName][0] };
    }
    return undefined;
  };

  const { registration } = profileStore;
  const isLockedAsyncButton = ref<boolean>(false);

  const signUp = async ():Promise<void> => {
    if (v$.value.$invalid) return;
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

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
