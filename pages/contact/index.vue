<template>
  <div class="contact">
    <img
      class="img"
      src="@/assets/img/msg.png"
      width="348"
      height="301"
      alt=""
    />
    <div class="header">
      <div class="heading">Contact us</div>
      <p class="info">Please, fill the information below. All Fields are required.</p>
    </div>
    <div class="form">
      <form-input-text
        v-model:value="state.emailText"
        type="text"
        name="email"
        :label="fieldsContent.email.label"
        :placeholder="fieldsContent.email.placeholder"
      />
      <form-input-textarea
        v-model:value="state.messageText"
        name="message"
        :label="fieldsContent.message.label"
        :placeholder="fieldsContent.message.placeholder"
      />
      <button-base
        type="primary"
        size="lg"
        :is-disabled="isDisabledButton"
        @click="showAtomicAlert"
      >Let’s talk! <atomic-icon id="ui-arrow_next"/></button-base>
    </div>
    <atomic-alert
      v-if="state.showAlert"
      :isShow="state.showAlert"
      title="Thank you!"
      variant="done"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { fieldsContent } = storeToRefs(globalStore);

  const state = reactive({
    emailText: '',
    messageText: '',
    showAlert: false,
  });

  const isDisabledButton = computed(() => (!(state.emailText.length > 0 && state.messageText.length > 0)));

  const showAtomicAlert = ():void => {
    state.showAlert = true;
  };
</script>

<style lang="scss" src="./style.scss" />
