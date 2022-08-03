<template>
  <form class="form-forgot-pass">
    <form-input-text
      type="email"
      name="email"
      :is-required="true"
      v-model:value="emailText"
      :label="fieldsContent.email.label"
      :placeholder="fieldsContent.email.placeholder"
    />
    <button-base
      type="primary"
      size="md"
      isDisabledButton
      :is-disabled="isDisabledButton"
      @click="closeModal('forgotPass')"
    >Reset password</button-base>
    <button-text-join />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { closeModal } = useLayoutStore();
  const fieldsStore = useFieldsStore();

  const { fieldsContent } = storeToRefs(fieldsStore);

  const emailText = ref<string>('');

  const isDisabledButton = computed(() => !emailText.value.length);
</script>

<style lang="scss" src="./style.scss" />
