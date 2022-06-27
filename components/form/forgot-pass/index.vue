<template>
  <form class="form-forgot-pass">
    <form-input-text
      type="email"
      name="email"
      :is-required="true"
      v-model:value="state.emailText"
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
  const state = reactive({
    emailText: '',
  });

  const isDisabledButton = computed(() => !(state.emailText.length > 0));
</script>

<style lang="scss" src="./style.scss" />
