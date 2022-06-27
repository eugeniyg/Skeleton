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
      @click="showModal('register')"
    >Sign up</button-base>
    <button-text-join />
  </form>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { showModal } = useLayoutStore();

  const { fieldsContent } = storeToRefs(globalStore);

  const emailText = ref<string>('');

  const isDisabledButton = computed(() => !emailText.value.length);
</script>

<style lang="scss" src="./style.scss" />
