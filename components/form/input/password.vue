<template>
  <label :class="classes">
    <span v-if="props.label" class="label">
      {{ props.label }}<span class="required" v-if="props.isRequired">*</span>
    </span>

    <div class="row">
      <input
        class="field"
        :type="type"
        :readonly="props.isDisabled"
        :name="props.name"
        :required="props.isRequired"
        :placeholder="props.placeholder"
        :value="props.value"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keyup.enter="emit('submit', $event)"
      />
      <button-toggle-type @change-type="changeType"/>
    </div>

    <atomic-pass-progress v-if="props.showPassProgress" :target="progressTarget"/>
    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: ' ',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
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
    hint: {
      type: Object,
      required: false,
    },
    showPassProgress: {
      type: Boolean,
      default: false,
    },
  });

  const classes = computed(() => [
    'input-password',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
  ]);

  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);
  const onBlur = (e: any):void => {
    emit('blur', e.target.value);
  };
  const onFocus = (e: any):void => {
    emit('focus', e.target.value);
  };

  const progressTarget = ref<string>('');
  const checkPassProgress = (e:any) => {
    const { length } = e.target.value;

    if (length <= 2 && length > 0) {
      progressTarget.value = 'weak';
    } else if (length <= 4 && length > 0) {
      progressTarget.value = 'good';
    } else if (length > 4 && length > 0) {
      progressTarget.value = 'strong';
    } else {
      progressTarget.value = '';
    }
  };

  const onInput = (e:any):void => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
    checkPassProgress(e);
  };

  const type = ref<string>('password');
  const changeType = (data:string):void => {
    type.value = data;
  };
</script>

<style src="~/assets/styles/components/form/input/password.scss" lang="scss" />

