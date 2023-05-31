<template>
  <div class="input-gender">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-input-radio
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      value="male"
      id="male"
      :isChecked="props.value === 'male'"
      @change="changeValue('male')"
    >
      {{ getContent(fieldsContent, defaultLocaleFieldsContent, 'gender.maleLabel') }}<atomic-icon id="male"/>
    </form-input-radio>

    <form-input-radio
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      value="female"
      id="female"
      :isChecked="props.value === 'female'"
      @change="changeValue('female')"
    >
      {{ getContent(fieldsContent, defaultLocaleFieldsContent, 'gender.femaleLabel') }}<atomic-icon id="female"/>
    </form-input-radio>

    <form-input-radio
      v-if="!props.isDisabled"
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      :value="null"
      id="other"
      :isChecked="!props.value"
      @change="changeValue(null)"
    >
      {{ getContent(fieldsContent, defaultLocaleFieldsContent, 'gender.otherLabel') }}<atomic-icon id="other"/>
    </form-input-radio>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const { fieldsContent, defaultLocaleFieldsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const emit = defineEmits(['update:value', 'focus']);
  const changeValue = (value:string):void => {
    emit('focus', value);
    emit('update:value', value);
  };
</script>

<style src="~/assets/styles/components/form/input/gender.scss" lang="scss" />

