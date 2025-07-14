<template>
  <label :class="classes">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <div class="row">
      <input
        class="field"
        :type="props.type || 'text'"
        :name="props.name"
        :value="props.value"
        :disabled="props.isDisabled"
        :required="props.isRequired"
        :placeholder="props.placeholder || ''"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      />

      <button-verify
        :is-shown="!!profile?.email && !profile?.confirmedAt"
        :class="{ disabled: resentVerifyEmail }"
        @click.once="profileStore.resendVerifyEmail"
      >
        {{ props.verifyButton || 'Verify' }}
      </button-verify>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
  </label>
</template>

<script setup lang="ts">
  const props = defineProps<{
    type?: string;
    name: string;
    value: string;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    hint?: { variant: string; message: string };
    verifyButton: string;
  }>();
  const emit = defineEmits(['blur', 'focus', 'input', 'update:value']);

  const profileStore = useProfileStore();
  const { resentVerifyEmail, profile } = storeToRefs(profileStore);

  const classes = computed(() => [
    'input-email-verify',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-hidden': props.type === 'hidden' },
  ]);

  const onBlur = (e: any) => {
    emit('blur', e.target.value);
  };
  const onFocus = (e: any) => {
    emit('focus', e.target.value);
  };

  const onInput = (e: any) => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };
</script>

<style src="~/assets/styles/components/form/input/email-verify.scss" lang="scss" />
