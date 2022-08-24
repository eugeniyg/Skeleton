<template>
  <div class="tb-profile">
    <div v-for="field in profileViewFields" :key="field.name" class="row">
      <div class="th">{{ fieldsContent[field.name]?.label || '' }}</div>

      <div class="td">
        <!--        <atomic-row-phone v-if="field.name === 'phone'" v-bind="td.props"/>-->
        <atomic-row-sex v-if="field.name === 'gender' && profile.gender" :value="profile.gender"/>
        <template v-else-if="field.name === 'birthdate'">{{ profile[field.name]?.split(' ')[0] || '-' }}</template>
        <template v-else-if="field.name === 'phone'">{{ profile[field.name] ? `+${profile[field.name]}`: '-' }}</template>
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
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const globalStore = useGlobalStore();
  const { fieldsContent } = storeToRefs(globalStore);
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const profileViewFields = profileFields.value.filter((field) => !hideFields.includes(field.name));
</script>

<style lang="scss" src="./style.scss"/>
