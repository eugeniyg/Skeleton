<template>
  <div class="input-phone" :class="{ 'has-error': props.hint?.variant === 'error' }">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <form-input-dropdown
      v-model:value="codeValue"
      :options="selectItems"
      :placeholder="countryCodePlaceholder"
      name="phoneCode"
      :hint="props.hint ? { variant: 'error', message: '' } : undefined"
      @focus="onFocus"
      @input="onSelectInput"
    />

    <client-only>
      <input
        ref="inputRef"
        v-model="numberValue"
        v-maska="'############'"
        inputmode="numeric"
        class="field"
        type="text"
        name="phoneNumber"
        :placeholder="phoneNumberPlaceholder"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      />
    </client-only>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
  </div>
</template>

<script setup lang="ts">
  import parsePhoneNumber from 'libphonenumber-js';
  import { storeToRefs } from 'pinia';
  import type { IPhoneCode } from '@skeleton/types';

  const props = defineProps<{
    label?: string;
    value?: string;
    isRequired?: boolean;
    placeholder?: {
      countryCode: string;
      phoneNumber: string;
    };
    hint?: { variant: string; message: string };
  }>();

  const globalStore = useGlobalStore();
  const { countries, headerCountry } = storeToRefs(globalStore);
  const selectItems: IPhoneCode[] = countries.value
    .map(country => ({
      countryCode: country.code,
      code: country.phonePrefix,
      mask: `/img/flags/${country.code.toLowerCase()}.svg`,
      value: `+${country.phonePrefix}`,
    }))
    .sort((prevItem, nextItem) => {
      if (prevItem.code > nextItem.code) return 1;
      if (prevItem.code < nextItem.code) return -1;
      return 0;
    });
  const codeValue = ref<string>('');
  const numberValue = ref<string>('');
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const countryCodePlaceholder = computed(() => {
    if (props.placeholder?.countryCode) return props.placeholder.countryCode;
    return '';
  });

  const phoneNumberPlaceholder = computed(() => {
    if (props.placeholder?.phoneNumber) return props.placeholder.phoneNumber;
    return '';
  });

  const setMobileCode = (countryCode: string): void => {
    const searchPhone = selectItems.find(phoneObj => phoneObj.countryCode === countryCode);
    codeValue.value = searchPhone?.code || '';
  };

  if (props.value) {
    const parsePhone = parsePhoneNumber(`+${profile.value?.phone}`);
    if (parsePhone) {
      const searchPhone = selectItems.find(phoneObj => phoneObj.countryCode === parsePhone.country);
      if (searchPhone?.code) {
        codeValue.value = searchPhone.code || '';
        numberValue.value = parsePhone.number.replace(searchPhone.code, '');
      }
    }
  } else if (profile.value?.country) setMobileCode(profile.value.country);
  else if (headerCountry.value) setMobileCode(headerCountry.value);

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = (): void => {
    emit('focus');
  };

  const onInput = (): void => {
    if (codeValue.value && numberValue.value) {
      emit('update:value', codeValue.value + numberValue.value);
      emit('input', codeValue.value + numberValue.value);
    } else {
      emit('update:value', '');
      emit('input', '');
    }
  };

  const onBlur = (): void => {
    emit('blur');
  };

  const onSelectInput = (): void => {
    onInput();
    onBlur();
  };

  const inputRef = ref();

  const focusField = (): void => {
    inputRef.value?.focus();
  };

  defineExpose({
    focusField,
  });
</script>

<style src="~/assets/styles/components/form/input/phone.scss" lang="scss" />
