<template>
  <label :class="classes" :for="props.name">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <div class="row">
      <input
        class="field"
        :type="type"
        :id="props.name"
        :name="props.name"
        :required="props.isRequired ? 'required': false"
        :placeholder="props.placeholder"
        @blur="onBlur"
        @input="onInput"
        @keyup.enter="emit('submit', $event)"
      />
      <button-toggle-type @change-type="changeType"/>
    </div>

    <atomic-pass-progress :target="progressTarget"/>
    <atomic-hint v-bind="props.hint"/>
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
    hint: {
      type: Object || null,
    },
  });

  const isError = computed(() => props.hint && props.hint.variant === 'error');
  const classes = computed(() => [
    'input-password',
    { 'has-error': isError.value },
  ]);

  const emit = defineEmits(['blur', 'input', 'submit']);
  const onBlur = (e: any):void => {
    emit('blur', e);
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

  const onInput = (e:InputEvent):void => {
    emit('input', e);
    checkPassProgress(e);
  };

  const type = ref<string>('password');
  const changeType = (data:string):void => {
    console.log(data);
    type.value = data;
  };
</script>

<style lang="scss" src="./style.scss"/>
