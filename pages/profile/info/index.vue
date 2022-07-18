<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Profile info</h1>
      <button-base
        v-if="!isProfileEdit"
        type="secondary"
        size="md"
        @click="toggleProfileEdit"
      >
        <atomic-icon id="ui-edit"/>Edit your profile

        <!--        <template v-if="isProfileEdit">-->
        <!--          <atomic-icon id="ui-done"/>Done editing-->
        <!--        </template>-->

        <!--        <template v-else>-->
        <!--          <atomic-icon id="ui-edit"/>Edit your profile-->
        <!--        </template>-->
      </button-base>
    </div>

    <form-profile v-if="isProfileEdit" @toggle-profile-edit="toggleProfileEdit"/>

    <template v-else>
      <div class="row-user">
        <atomic-avatar-profile :is-edit="false"/>

        <div class="items">
          <div class="nickname">{{ publicNickname }}</div>

          <div class="item" v-show="profile.firstName || profile.lastName">
            <atomic-icon id="ui-user"/>
            {{ `${profile.firstName} ` }}{{ profile.lastName }}
          </div>

          <div class="item" v-show="profile.country || profile.city">
            <atomic-icon id="ui-location"/>
            {{ userCountryName }}{{ profile.city ? `, ${profile.city}` : '' }}
          </div>

          <div class="item" v-show="profile.email">
            <atomic-icon class="is-success" id="ui-done"/>
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
          {{ fieldsContent[field.name]?.label }}
        </form-input-toggle>

        <atomic-divider/>
      </div>
    </template>

    <h4 class="heading">Manage account</h4>

    <button-base type="ghost" size="md" @click="profileStore.logOutUser">
      <atomic-icon id="ui-log-out"/>Log out
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useProfileApi, CountryInterface } from '~/CORE';

  const { changePromo } = useProfileApi();
  const profileStore = useProfileStore();
  const { profile, profileFields, publicNickname } = storeToRefs(profileStore);
  const globalStore = useGlobalStore();
  const { countries, fieldsContent } = storeToRefs(globalStore);
  const route = useRoute();
  const router = useRouter();

  const isProfileEdit = computed(() => route.query.edit === 'true');
  const userCountryName = computed(() => {
    const countryObject:CountryInterface|undefined = countries.value.find((country) => country.code === profile.value.country);
    return countryObject?.nativeName || '';
  });
  const subscriptionFields = computed(() => profileFields.value.filter((field) => field.name === 'receiveSmsPromo' || field.name === 'receiveEmailPromo'));

  const toggleProfileEdit = ():void => {
    router.push({ query: { ...route.query, edit: isProfileEdit.value ? undefined : 'true' } });
  };

  const changeSubscription = async (fieldName:string):Promise<void> => {
    const data = await changePromo({ [fieldName]: !profile.value[fieldName] });
    profileStore.setProfileData(data);
  };
</script>

<style lang="scss" src="./style.scss"/>
