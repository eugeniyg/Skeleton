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
        type="email"
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
        @click="submitContactForm"
      >Let’s talk! <atomic-icon id="ui-arrow_next"/></button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const globalStore = useGlobalStore();
  const { fieldsContent } = storeToRefs(globalStore);

  const state = reactive({
    emailText: '',
    messageText: '',
  });

  const isDisabledButton = computed(() => (!(state.emailText.length > 0 && state.messageText.length > 0)));

  const submitContactForm = ():void => {
    layoutStore.showAlert({
      title: 'Thank you!',
      text: undefined,
      variant: 'done',
    });

    state.emailText = '';
    state.messageText = '';
  };
</script>

<style lang="scss" src="./style.scss" />
