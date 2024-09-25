<template>
  <label :class="classes">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <client-only>
      <div class="mask-group">
        <input
          v-model="maskedValue"
          v-maska:unmaskedValue.unmasked
          inputmode="numeric"
          data-maska="###.###.###-##"
          data-maska-eager
          class="field"
          type="text"
          name="cpfNumber"
          :placeholder="props.placeholder || ''"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
        >

        <div v-show="maskedValue || focused" class="mask-group__fake">
          <span class="mask-group__fake-hidden">{{ maskedValue }}</span>
          <span class="mask-group__fake-visible">{{ visibleValue }}</span>
        </div>
      </div>
    </client-only>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label?: string;
    value?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    placeholder?: string;
    hint?: any;
  }>();

  const maskedValue = ref('');
  const unmaskedValue = ref('');
  defineExpose({ unmaskedValue });

  if (props.value) maskedValue.value = props.value || '';
  const maskPlaceholder = '___.___.___-__';
  const focused = ref<boolean>(false);

  const visibleValue = computed(() => {
    return maskPlaceholder.slice(maskedValue.value.length, maskPlaceholder.length);
  })

  const classes = computed(() => [
    'input-cpf-number',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled }
  ]);

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = ():void => {
    emit('focus', unmaskedValue.value);
    focused.value = true;
  };

  const onInput = (event: any):void => {
    if (event.isTrusted) return;

    emit('update:value', unmaskedValue.value);
    emit('input', unmaskedValue.value);
  };

  const onBlur = ():void => {
    emit('blur', unmaskedValue.value);
    focused.value = false;
  };
</script>

<style src="~/assets/styles/components/form/input/cpf-number.scss" lang="scss" />
