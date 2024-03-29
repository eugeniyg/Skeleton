<template>
  <label :class="classes">
    <span v-if="props.label" class="label">
      {{ props.label }}<span class="required" v-if="props.isRequired">*</span>
    </span>

    <client-only>
      <div class="mask-group">
        <input
          inputmode="numeric"
          v-maska="bindedObject"
          data-maska="###.###.###-##"
          data-maska-eager
          class="field"
          type="text"
          name="cpfNumber"
          v-model="inputValue"
          :placeholder="props.placeholder || ''"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
        />

        <div v-show="bindedObject.masked || focused" class="mask-group__fake">
          <span class="mask-group__fake-hidden">{{ bindedObject.masked }}</span>
          <span class="mask-group__fake-visible">{{ visibleValue }}</span>
        </div>
      </div>
    </client-only>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  import { vMaska } from 'maska';
  import type { MaskaDetail } from 'maska';

  const props = defineProps<{
    label?: string;
    value?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    placeholder?: string;
    hint?: any;
  }>();

  const bindedObject = reactive<MaskaDetail>({
    masked: '',
    unmasked: '',
    completed: false
  });
  const inputValue = ref<string>('');
  if (props.value) inputValue.value = props.value || '';
  const maskPlaceholder = '___.___.___-__';
  const focused = ref<boolean>(false);

  const visibleValue = computed(() => {
    return maskPlaceholder.slice(bindedObject.masked.length, maskPlaceholder.length);
  })

  const classes = computed(() => [
    'input-cpf-number',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled }
  ]);

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = ():void => {
    emit('focus', bindedObject.unmasked);
    focused.value = true;
  };

  const onInput = (event: any):void => {
    if (event.isTrusted) return;

    emit('update:value', bindedObject.unmasked);
    emit('input', bindedObject.unmasked);
  };

  const onBlur = ():void => {
    emit('blur', bindedObject.unmasked);
    focused.value = false;
  };
</script>

<style src="~/assets/styles/components/form/input/cpf-number.scss" lang="scss" />
