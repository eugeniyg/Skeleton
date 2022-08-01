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
  import phoneCodes from '~/maps/phoneCodes.json';
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

  const selectItems:PhoneCodeInterface[] = phoneCodes.map((item) => ({ ...item, value: item.code, mask: `/img/flags/${item.countryCode.toLowerCase()}.svg` }));
  const codeValue = ref<string>('');
  const numberValue = ref<string>('');
  const profileStore = useProfileStore();

  if (props.value) {
    const parsePhone = parsePhoneNumber(`+${profileStore.profile.phone}`);
    if (parsePhone) {
      const searchPhone = phoneCodes.find((item) => item.countryCode === parsePhone.country || item.code === `+${parsePhone.countryCallingCode}`);
      codeValue.value = searchPhone?.code || '';
      numberValue.value = parsePhone.number.replace(searchPhone?.code, '');
    }
  }

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = ():void => {
    emit('focus');
  };

  const onInput = ():void => {
    if (codeValue.value && numberValue.value) {
      emit('update:value', codeValue.value.slice(1) + numberValue.value);
      emit('input', codeValue.value.slice(1) + numberValue.value);
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
