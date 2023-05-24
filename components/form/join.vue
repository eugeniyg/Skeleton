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
          :label="getContent(fieldsContent, defaultLocaleFieldsContent, `${field.name}.label`) || ''"
          :name="field.name"
          :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, `${field.name}.placeholder`) || ''"
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
        :label="getContent(fieldsContent, defaultLocaleFieldsContent, `${field.name}.label`) || ''"
        :name="field.name"
        :placeholder="getContent(fieldsContent, defaultLocaleFieldsContent, `${field.name}.placeholder`) || ''"
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
  import { FieldInterface } from '@platform/frontend-core/dist/module';
  import fieldsTypeMap from '~/maps/fieldsTypeMap.json';

  const props = defineProps<{
    registrationFields: FieldInterface[]
  }>();

  const groupFooterFields = ['agreements', 'receiveEmailPromo', 'receiveSmsPromo'];

  const { setFormData } = useCoreMethods();
  const { closeModal } = useLayoutStore();
  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const globalStore = useGlobalStore();
  const {
    countries,
    fieldsContent,
    defaultLocaleFieldsContent,
    popupsData,
    defaultLocalePopupsData,
    headerCountry,
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const mainFields = props.registrationFields.filter((field) => !groupFooterFields.includes(field.name));
  const footerFields = props.registrationFields.filter((field) => groupFooterFields.includes(field.name));
  const registrationFormData = reactive(setFormData(props.registrationFields));
  if (registrationFormData.hasOwnProperty('nickname')) registrationFormData.nickname = 'undefined';
  if (registrationFormData.hasOwnProperty('currency')) registrationFormData.currency = 'BTC';
  if (registrationFormData.hasOwnProperty('country') && !registrationFormData.country) {
    if (countries.value.find((country) => country.code === headerCountry.value)) {
      registrationFormData.country = headerCountry.value;
    }
  }

  const getCheckboxLabel = (fieldName: string):string|undefined => {
    if (fieldName === 'receiveEmailPromo') return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.agreeEmailLabel');
    if (fieldName === 'receiveSmsPromo') return getContent(popupsData.value, defaultLocalePopupsData.value, 'registration.agreeSmsLabel');
    return getContent(fieldsContent.value, defaultLocaleFieldsContent.value, `${fieldName}.label`) || '';
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
