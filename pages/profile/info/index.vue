<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Profile info</h1>
      <button-base type="secondary" size="md" @click="toggleProfileEdit">
        <template v-if="isProfileEdit">
          <atomic-icon id="ui-done"/>Done editing
        </template>

        <template v-else>
          <atomic-icon id="ui-edit"/>Edit your profile
        </template>
      </button-base>
    </div>

    <form-profile v-if="isProfileEdit" @toggle-profile-edit="toggleProfileEdit"/>

    <template v-else>
      <div class="row-user">
        <atomic-avatar-profile :is-edit="false"/>

        <div class="items">
          <div class="nickname">{{ profile.nickname }}</div>

          <div class="item" v-show="profile.firstName || profile.lastName">
            <atomic-icon id="ui-user"/>
            {{ `${profile.firstName} ` }}{{ profile.lastName }}
          </div>

          <div class="item" v-show="profile.country || profile.city">
            <atomic-icon id="ui-location"/>
            {{ userCountryName }}{{ profile.city ? `, ${profile.city}` : '' }}
          </div>

          <div class="item" v-show="profile.email">
            <atomic-icon v-if="profile.confirmedAt" class="is-success" id="ui-done"/>
            <atomic-icon v-else class="is-warning" id="ui-warning"/>
            {{ profile.email }}
          </div>
        </div>
      </div>

      <table-profile/>

      <atomic-divider/>
    </template>

    <template v-if="subscriptionFields.length">
      <h4 class="heading">Subscriptions</h4>

      <div class="group">
        <form-input-toggle
          v-for="field in subscriptionFields"
          :key="field.name"
          :name="field.name"
          :value="profile[field.name]"
          @change="changeSubscription(field.name)"
        >
          {{ field.description }}
        </form-input-toggle>

        <atomic-divider/>
      </div>
    </template>

    <h4 class="heading">Manage account</h4>

    <button-base type="ghost" size="md" @click="userStore.logOutUser">
      <atomic-icon id="ui-log-out"/>Log out
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useProfileApi } from '~/CORE';
  import { countryInterface } from '~/types/globalDataTypes';

  const { changePromo } = useProfileApi();
  const userStore = useUserStore();
  const { profile, profileFields } = storeToRefs(userStore);
  const { countries } = useGlobalStore();

  const isProfileEdit = ref<boolean>(false);
  const userCountryName = computed(() => {
    const countryObject:countryInterface|undefined = countries.find((country) => country.code === profile.value.country);
    return countryObject?.nativeName || '';
  });
  const subscriptionFields = computed(() => profileFields.value.filter((field) => field.name === 'receiveSmsPromo' || field.name === 'receiveEmailPromo'));

  const toggleProfileEdit = ():void => {
    isProfileEdit.value = !isProfileEdit.value;
  };

  const changeSubscription = async (fieldName:string):Promise<void> => {
    const data = await changePromo({ [fieldName]: !profile.value[fieldName] });
    console.log(data);
    userStore.setProfileData(data);
  };
</script>

<style lang="scss" src="./style.scss"/>
