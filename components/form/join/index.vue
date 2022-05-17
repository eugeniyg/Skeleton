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
          :label="field.description"
          :name="field.name"
          :placeholder="field.description"
        />
      </template>

      <component
        v-else
        :key="field.name"
        :is="fieldsTypeMap[field.name].component || 'form-input-text'"
        v-model:value="registrationFormData[field.name]"
        :type="fieldsTypeMap[field.name].type || 'text'"
        :label="field.description"
        :name="field.name"
        :placeholder="field.description"
        :options="selectOptions[field.name]"
      />
    </template>

    <atomic-divider/>

    <form-input-checkbox
      v-for="field in footerFields"
      v-model:value="registrationFormData[field.name]"
      :key="field.name"
      :name="field.name"
    >
      <p v-html="field.description"/>
    </form-input-checkbox>

    <button-base type="primary" size="md" @click="signUp">Sign up</button-base>

    <button-text-sign/>
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useAuthApi, useGlobalMethods } from '@platform/frontend-core';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';
  import { fieldInterface } from '~/types/formTypes';

  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { getRegistrationFields, submitRegistrationData } = useAuthApi();
  const { setFormData } = useGlobalMethods();
  const registrationFields: fieldInterface[] = await getRegistrationFields();
  const mainFields = registrationFields.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = registrationFields.filter((field) => groupFooterFields.includes(field.name));
  const registrationFormData = reactive(setFormData(registrationFields));

  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const showPromoInput = ref<boolean>(false);

  const signUp = async ():Promise<void> => {
    try {
      const submitResult = await submitRegistrationData(registrationFormData);
      console.log(submitResult);
    } catch (error) {
      if (error.response?.status === 422) {
        alert('Validation error!');
      } else throw error;
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
