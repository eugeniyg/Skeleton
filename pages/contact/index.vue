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
        v-model:value="state.email"
        type="email"
        name="email"
        :label="fieldsContent.email.label || ''"
        :placeholder="fieldsContent.email.placeholder || ''"
        :hint="setError('email')"
        @blur="onBlur('email')"
      />

      <form-input-textarea
        v-model:value="state.message"
        name="message"
        :label="fieldsContent.message.label || ''"
        :placeholder="fieldsContent.message.placeholder || ''"
        :hint="setError('message')"
        @blur="onBlur('message')"
      />

      <button-base
        type="primary"
        size="lg"
        :is-disabled="v$.$invalid"
        @click="submitContactForm"
      >Let’s talk! <atomic-icon id="ui-arrow_next"/></button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import useVuelidate from '@vuelidate/core';

  const layoutStore = useLayoutStore();
  const fieldsStore = useFieldsStore();
  const { fieldsContent } = storeToRefs(fieldsStore);

  const state = reactive({
    email: '',
    message: '',
  });

  const contactUsRules = {
    email: [{ rule: 'required' }, { rule: 'email' }],
    message: [{ rule: 'required' }],
  };

  const { getFormRules } = useProjectMethods();
  const contactUsFormRules = getFormRules(contactUsRules);
  const v$ = useVuelidate(contactUsFormRules, state);

  const onBlur = (fieldName:string):void => {
    v$.value[fieldName]?.$touch();
  };

  const setError = (fieldName:string):undefined|{ variant: string, message: any } => {
    if (v$.value[fieldName]?.$error) {
      return { variant: 'error', message: v$.value[fieldName].$errors[0].$message };
    }
    return undefined;
  };

  const submitContactForm = async ():Promise<void> => {
    if (v$.value.$invalid) return;

    v$.value.$reset();
    const validFormData = await v$.value.$validate();
    if (!validFormData) return;

    layoutStore.showAlert({
      title: 'Thank you!',
      text: undefined,
      variant: 'done',
    });

    state.email = '';
    state.message = '';
    v$.value.$reset();
  };
</script>

<style lang="scss" src="./style.scss" />
