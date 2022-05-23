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
          :isRequired="registrationFormRules[field.name].hasOwnProperty('required')"
          :label="field.description"
          :name="field.name"
          :placeholder="field.description"
          @blur="v$[field.name]?.$touch()"
          :hint="setError(field.name)"
        />
      </template>
      <component
        v-else
        :key="field.name"
        @blur="v$[field.name]?.$touch()"
        :is="fieldsTypeMap[field.name].component || 'form-input-text'"
        v-model:value.lazy="registrationFormData[field.name]"
        :type="fieldsTypeMap[field.name].type || 'text'"
        :label="field.description"
        :name="field.name"
        :placeholder="field.description"
        :options="selectOptions[field.name]"
        :isRequired="registrationFormRules[field.name].hasOwnProperty('required')"
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
    >
      <p v-if="field.name === 'agreements'"><a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a></p>
      <p v-else-if="field.name === 'receiveEmailPromo'">I agree to receive bonus & marketing emails</p>
      <p v-else v-html="field.description"/>
    </form-input-checkbox>

    <button-base
      tagName="div"
      type="primary"
      size="md"
      @click="signUp"
    >Sign up</button-base>

    <button-text-sign @click="showModal('signIn')" />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useAuthApi, useGlobalMethods } from '@platform/frontend-core';
  import useVuelidate from '@vuelidate/core';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';
  import { fieldInterface } from '~/types/formTypes';

  const props = defineProps({
    show: {
      type: Boolean,
      required: true,
    },
  });

  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { getRegistrationFields, submitRegistrationData } = useAuthApi();
  const { setFormData } = useGlobalMethods();
  const { showModal, closeModal } = useLayoutStore();

  const registrationFields: fieldInterface[] = await getRegistrationFields();
  const mainFields = registrationFields.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = registrationFields.filter((field) => groupFooterFields.includes(field.name));

  const registrationFormData = reactive(setFormData(registrationFields));

  const { getFormRules } = useProjectMethods();
  const registrationFormRules = getFormRules(registrationFields);
  const serverFormErrors = ref<any>({});
  const v$ = useVuelidate(registrationFormRules, registrationFormData, { $lazy: true });

  watch(() => props.show, (newValue:boolean) => {
    if (!newValue) {
      Object.keys(registrationFormData).forEach((key) => {
        registrationFormData[key] = '';
      });
      v$.value.$reset();
      serverFormErrors.value = {};
    }
  });

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

  const { setToken } = useUserStore();
  const signUp = async ():Promise<void> => {
    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    try {
      const submitResult = await submitRegistrationData(registrationFormData);
      setToken(submitResult);
      closeModal('register');
    } catch (error) {
      if (error.response?.status === 422) {
        serverFormErrors.value = error.data?.error?.fields;
      } else throw error;
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
