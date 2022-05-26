<template>
  <div class="tb-profile">
    <div v-for="field in profileViewFields" :key="field.name" class="row">
      <div class="th">{{ field.description }}</div>

      <div class="td">
        <!--        <atomic-row-phone v-if="field.name === 'phone'" v-bind="td.props"/>-->
        <atomic-row-sex v-if="field.name === 'gender' && profile.gender" :value="profile.gender"/>
        <template v-else>{{ profile[field.name] || '-' }}</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const hideFields = [
    'firstName',
    'lastName',
    'nickname',
    'city',
    'country',
    'email',
    'password',
    'password_confirmation',
    'receiveSmsPromo',
    'receiveEmailPromo',
  ];
  const userStore = useUserStore();
  const { profileFields, profile } = storeToRefs(userStore);
  console.log(profileFields.value);
  const profileViewFields = profileFields.value.filter((field) => !hideFields.includes(field.name));
</script>

<style lang="scss" src="./style.scss"/>
