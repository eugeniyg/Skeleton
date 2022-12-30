<template>
  <div class="input-phone" :class="{ 'has-error': props.hint?.variant === 'error' }">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-input-dropdown
      v-model:value="codeValue"
      :options="selectItems"
      placeholder="Select code"
      name="phoneCode"
      @focus="onFocus"
      @input="onSelectInput"
      :hint="props.hint ? { variant: 'error', message: '' } : undefined"
    />

    <client-only>
      <input
        inputmode="numeric"
        v-maska
        data-maska="##########"
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
    </client-only>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </div>
</template>

<script setup lang="ts">
  import parsePhoneNumber from 'libphonenumber-js';
  import { storeToRefs } from 'pinia';
  import { vMaska } from 'maska';
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
  const { countries, headerCountry } = storeToRefs(globalStore);
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
    const parsePhone = parsePhoneNumber(`+${profile.value?.phone}`);
    if (parsePhone) {
      const searchPhone = selectItems.find((phoneObj) => phoneObj.countryCode === parsePhone.country);
      if (searchPhone?.code) {
        codeValue.value = searchPhone.code || '';
        numberValue.value = parsePhone.number.replace(searchPhone.code, '');
      }
    }
  } else if (profile.value?.country) setMobileCode(profile.value.country);
  else if (headerCountry.value) setMobileCode(headerCountry.value);

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

<style lang="scss">
.input-phone {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: minmax(0, auto) auto;
  grid-template-areas: "label label";
  grid-column-gap: 8px;
  width: 100%;

  .hint {
    margin-top: rem(6px);
    grid-column: 1/3;
  }

  @extend %input-label;

  .dropdown {
    min-width: rem(150px);
  }

  .field {
    width: 100%;
    background-color: var(--bg, var(--gray-800));
    padding: var(--input-padding-y, #{rem(11px)}) rem(16px);
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    border-radius: 8px;
    @include font($body-2);
    transition: border-color .2s ease-in-out;
    @extend %inputMask;
    font-family: 'NeoSansPro', sans-serif;

    &::placeholder {
      color: var(--gray-400);
    }

    &:focus {
      --border-color: var(--gray-300);
    }
  }

  &.has-error {
    .field {
      --border-color: var(--red-800);
    }
  }
}
</style>
