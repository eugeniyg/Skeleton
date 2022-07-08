<template>
  <div class="security content">
    <div class="header">
      <h1 class="heading">Security & Verification</h1>
    </div>

    <hr/>

    <form class="form form-change">
      <div v-for="field in changeFormData" :key="field.name" :class="`row row-${field.name}`">
        <form-input-password
          v-model:value="field.value"
          type="password"
          :name="field.name"
          :label="field.description"
          :placeholder="field.placeholder"
          :show-pass-progress="field.isShowPassProgress"
          :is-required="true"
          @submit="onSubmit"
        />
      </div>

      <button-base
        type="primary"
        size="md"
        tagName="div"
        @click="() => {}"
        :isDisabled="true"
      >
        Save changes
      </button-base>
    </form>
  </div>
</template>

<script setup lang="ts">
  const changeFormFields = [
    {
      name: 'old',
      description: 'Current password',
      placeholder: 'Enter your current password',
      value: '',
    },
    {
      name: 'new',
      description: 'New password',
      placeholder: 'Enter new password',
      isShowPassProgress: true,
      value: '',
    },
    {
      name: 'reenter',
      description: 'New password again',
      placeholder: 'Re-enter new password',
      value: '',
    },
  ];

  const changeFormData = reactive(changeFormFields);

  const onSubmit = (): void => {
  };
</script>

<style lang="scss" src="./style.scss"/>
