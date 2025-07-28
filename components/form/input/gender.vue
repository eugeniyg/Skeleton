<template>
  <div class="input-gender">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <form-input-radio
      id="male"
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      value="male"
      :is-checked="props.value === 'male'"
      @change="changeValue('male')"
    >
      {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.gender.maleLabel')
      }}<atomic-icon id="male" />
    </form-input-radio>

    <form-input-radio
      id="female"
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      value="female"
      :is-checked="props.value === 'female'"
      @change="changeValue('female')"
    >
      {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.gender.femaleLabel')
      }}<atomic-icon id="female" />
    </form-input-radio>

    <form-input-radio
      v-if="!props.isDisabled"
      id="other"
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      :value="null"
      :is-checked="!props.value"
      @change="changeValue(null)"
    >
      {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, 'fieldsControls.gender.otherLabel')
      }}<atomic-icon id="other" />
    </form-input-radio>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label?: string;
    value?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    hint?: { variant: string; message: string };
  }>();

  const { fieldsSettings, defaultLocaleFieldsSettings } = useGlobalStore();
  const emit = defineEmits(['update:value', 'focus']);
  const changeValue = (value: string | null): void => {
    emit('focus', value);
    emit('update:value', value);
  };
</script>

<style src="~/assets/styles/components/form/input/gender.scss" lang="scss" />
