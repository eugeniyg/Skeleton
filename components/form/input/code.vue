<template>
  <div class="input-code" :class="{ 'has-error': props.hint?.variant === 'error' }">
    <v-otp-input
      ref="otpInput"
      v-model:value="otpValue"
      input-classes="otp-input"
      inputType="number"
      separator=""
      :num-inputs="6"
      :should-focus-order="true"
      @onComplete="handleOnComplete"
      @onChange="handleChange"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </div>
</template>

<script setup lang="ts">
  import VOtpInput from "vue3-otp-input";

  const props = defineProps<{
    hint?: Record<string, any>;
  }>();

  const emit = defineEmits(['update:completeCode']);
  const otpInput = ref<InstanceType<typeof VOtpInput>>();
  const otpValue = ref<string>('');

  const handleOnComplete = (inputValue: string) => {
    emit('update:completeCode', inputValue);
  };

  const handleChange = (inputValue: string) => {
    if (inputValue.length !== 6) emit('update:completeCode', '');
  }

  const focusInput = ():void => {
    const firstInput = otpInput.value?.$el.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  defineExpose({focusInput});
</script>

<style src="~/assets/styles/components/form/input/code.scss" lang="scss" />
