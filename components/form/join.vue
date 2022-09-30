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
      {{ registrationContent?.registrationButton}}
    </button-base>

    <button-popup :buttonLabel="registrationContent?.loginButton" openModal="signIn" />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';
  import { RegistrationInterface } from '~/types';

  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { setFormData } = useCoreMethods();
  const { closeModal } = useLayoutStore();
  const fieldsStore = useFieldsStore();
  const { selectOptions, registrationFields } = storeToRefs(fieldsStore);
  const globalStore = useGlobalStore();
  const {
    initUserInfo, countries, fieldsContent, popupsData,
  } = storeToRefs(globalStore);
  const registrationContent: RegistrationInterface|undefined = popupsData.value?.registration;

  const mainFields = registrationFields.value.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = registrationFields.value.filter((field) => groupFooterFields.includes(field.name));
  const registrationFormData = reactive(setFormData(registrationFields.value));
  if (registrationFormData.hasOwnProperty('nickname')) registrationFormData.nickname = 'undefined';
  if (registrationFormData.hasOwnProperty('currency')) registrationFormData.currency = 'BTC';

  const checkInitCountry = ():void => {
    if (registrationFormData.hasOwnProperty('country') && !registrationFormData.country) {
      if (countries.value.find((country) => country.code === initUserInfo.value?.country)) {
        registrationFormData.country = initUserInfo.value.country;
      }
    }
  };
  checkInitCountry();
  watch(() => initUserInfo.value, () => {
    checkInitCountry();
  });

  const getCheckboxLabel = (fieldName: string):string => {
    if (fieldName === 'receiveEmailPromo') return registrationContent?.agreeEmailLabel;
    if (fieldName === 'receiveSmsPromo') return registrationContent?.agreeSmsLabel;
    return fieldsContent.value[fieldName]?.label || '';
  };

  const { getFormRules, createValidationRules } = useProjectMethods();
  const registrationRules = createValidationRules(registrationFields.value, true);
  const registrationFormRules = getFormRules(registrationRules);
  const {
    serverFormErrors, v$, onFocus, setError,
  } = useFormValidation(registrationFormRules, registrationFormData);

  const showPromoInput = ref<boolean>(false);

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

<style lang="scss">
.form-join {
  display: grid;
  grid-row-gap: rem(16px);

  hr {
    margin: 0;
  }

  .btn-primary {
    --width: 100%;
  }

  //.dropdown {
  //  .items {
  //    max-width: 100%;
  //  }
  //
  //  .item {
  //    display: block;
  //    overflow: hidden;
  //    text-overflow: ellipsis;
  //    position: relative;
  //    padding-left: rem(38px);
  //    padding-right: rem(30px);
  //
  //    .mask {
  //      position: absolute;
  //      left: rem(8px);
  //      top: 50%;
  //      transform: translateY(-50%);
  //    }
  //
  //    svg {
  //      position: absolute;
  //      right: rem(8x);
  //      top: 50%;
  //      transform: translateY(-50%);
  //    }
  //  }
  //}
}
</style>
