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
        v-model:value="contactFormData.email"
        type="email"
        name="email"
        :label="fieldsContent.email?.label || ''"
        :placeholder="fieldsContent.email?.placeholder || ''"
        :hint="setError('email')"
        @blur="v$.email?.$touch()"
      />

      <form-input-textarea
        v-model:value="contactFormData.message"
        name="message"
        :label="fieldsContent.message?.label || ''"
        :placeholder="fieldsContent.message?.placeholder || ''"
        :hint="setError('message')"
        @blur="v$.message?.$touch()"
      />

      <button-base
        type="primary"
        size="lg"
        :is-disabled="v$.$invalid"
        @click="submitContactForm"
      >Let’s talk! <atomic-icon id="arrow_next"/></button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const globalStore = useGlobalStore();
  const { fieldsContent, alertsData } = storeToRefs(globalStore);

  const contactFormData = reactive({
    email: '',
    message: '',
  });

  const contactUsRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
    message: [{ rule: 'required' }],
  };

  const { getFormRules } = useProjectMethods();
  const contactUsFormRules = getFormRules(contactUsRules);
  const { v$, setError } = useFormValidation(contactUsFormRules, contactFormData);

  const submitContactForm = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    layoutStore.showAlert(alertsData.value?.sentMessage);

    contactFormData.email = '';
    contactFormData.message = '';
    v$.value.$reset();
  };
</script>

<style lang="scss" src="./style.scss" />
