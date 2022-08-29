<template>
  <div class="input-phone" :class="{ 'has-error': props.hint?.variant === 'error' }">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-dropdown-base
      v-model:value="codeValue"
      :options="selectItems"
      placeholder="Select code"
      name="phoneCode"
      @focus="onFocus"
      @input="onSelectInput"
      :hint="props.hint ? { variant: 'error', message: '' } : undefined"
    />

    <input
      inputmode="numeric"
      v-maska="'##########'"
      class="field"
      type="text"
      name="phoneNumber"
      v-model="numberValue"
      :readonly="props.isDisabled"
      :placeholder="props.placeholder"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </div>
</template>

<script setup lang="ts">
  import parsePhoneNumber from 'libphonenumber-js';
  import { storeToRefs } from 'pinia';
  import { InitUserInfoInterface } from '@platform/frontend-core/dist/module';
  import { PhoneCodeInterface } from '~/types';

  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: false,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Enter number',
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const globalStore = useGlobalStore();
  const { countries, initUserInfo } = storeToRefs(globalStore);
  const selectItems:PhoneCodeInterface[] = countries.value.map((country) => ({
    countryCode: country.code,
    code: country.phonePrefix,
    mask: `/img/flags/${country.code.toLowerCase()}.svg`,
    value: `+${country.phonePrefix}`,
  }));
  const codeValue = ref<string>('');
  const numberValue = ref<string>('');
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const setMobileCode = (countryCode: string):void => {
    const searchPhone = selectItems.find((phoneObj) => phoneObj.countryCode === countryCode);
    codeValue.value = searchPhone?.code || '';
  };

  if (props.value) {
    const parsePhone = parsePhoneNumber(`+${profile.value.phone}`);
    if (parsePhone) {
      const searchPhone = selectItems.find((phoneObj) => phoneObj.countryCode === parsePhone.country);
      codeValue.value = searchPhone?.code || '';
      numberValue.value = parsePhone.number.replace(searchPhone?.code, '');
    }
  } else if (profile.value.country) setMobileCode(profile.value.country);
  else if (initUserInfo.value.country) setMobileCode(initUserInfo.value.country);

  watch(() => initUserInfo.value, (newValue: InitUserInfoInterface) => {
    if (!props.value) setMobileCode(newValue.country);
  });

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = ():void => {
    emit('focus');
  };

  const onInput = ():void => {
    if (codeValue.value && numberValue.value) {
      emit('update:value', codeValue.value + numberValue.value);
      emit('input', codeValue.value + numberValue.value);
    } else {
      emit('update:value', '');
      emit('input', '');
    }
  };

  const onBlur = ():void => {
    emit('blur');
  };

  const onSelectInput = ():void => {
    onInput();
    onBlur();
  };
</script>

<style lang="scss" src="./style.scss"/>
