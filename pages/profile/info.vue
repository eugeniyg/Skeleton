<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ infoContent?.title || defaultLocaleInfoContent?.title }}</h1>

      <button-base
        v-if="!isProfileEdit"
        type="secondary"
        size="md"
        @click="toggleProfileEdit"
      >
        <atomic-icon id="edit"/>{{ infoContent?.editButton || defaultLocaleInfoContent?.editButton }}

        <!--        <template v-if="isProfileEdit">-->
        <!--          <atomic-icon id="done"/>Done editing-->
        <!--        </template>-->

        <!--        <template v-else>-->
        <!--          <atomic-icon id="edit"/>Edit your profile-->
        <!--        </template>-->
      </button-base>
    </div>

    <form-profile
      v-if="isProfileEdit"
      @toggle-profile-edit="toggleProfileEdit"
      v-bind="infoContent || defaultLocaleInfoContent"
    />

    <template v-else>
      <div class="row-user">
        <atomic-avatar-profile :is-edit="false"/>

        <div class="items">
          <div class="nickname">{{ userNickname }}</div>

          <div class="item" v-show="profile.firstName || profile.lastName">
            <atomic-icon id="user"/>
            {{ profile.firstName }} {{ profile.lastName }}
          </div>

          <div class="item" v-show="profile.country || profile.city">
            <atomic-icon id="location"/>
            {{ userCountryName }}{{ profile.city ? `, ${profile.city}` : '' }}
          </div>

          <div class="item" v-show="profile.email">
            <atomic-icon v-if="profile.confirmedAt" class="is-success" id="done"/>
            <atomic-icon v-else class="is-warning" id="warning"/>
            {{ profile.email }}

            <span
              v-if="!profile.confirmedAt"
              class="btn-primary size-xs"
              @click.once="profileStore.resendVerifyEmail"
              :class="{ disabled: resentVerifyEmail }"
            >
              {{ infoContent?.sendButton || defaultLocaleInfoContent?.sendButton }}
            </span>
          </div>
        </div>
      </div>

      <table-profile/>

      <atomic-divider/>
    </template>

    <h4 class="heading">{{ infoContent?.subscriptionTitle || defaultLocaleInfoContent?.subscriptionTitle }}</h4>

    <div class="group">
      <form-input-toggle
        v-for="field in subscriptionFields"
        :key="field.name"
        :name="field.name"
        :value="profile[field.name]"
        @change="changeSubscription(field.name)"
      >
        {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) }}
      </form-input-toggle>

      <atomic-divider/>
    </div>

    <h4 class="heading">{{ infoContent?.manageTitle || defaultLocaleInfoContent?.manageTitle }}</h4>

    <button-base type="ghost" size="md" @click="profileStore.logOutUser">
      <atomic-icon id="log-out"/>{{ layoutData?.profileSidebar?.logoutButton || defaultLocaleLayoutData?.profileSidebar?.logoutButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ICountry } from '@platform/frontend-core';
  import { IProfileInfo } from '~/types';

  const globalStore = useGlobalStore();
  const {
    countries,
    fieldsSettings,
    defaultLocaleFieldsSettings,
    layoutData,
    defaultLocaleLayoutData,
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProfileInfoContent', () => queryContent(currentLocale.value?.code as string, 'profile', 'info').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProfileInfoContent', () => queryContent(defaultLocale.value?.code as string, 'profile', 'info').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const infoContent: Maybe<IProfileInfo> = currentLocaleData;
  const defaultLocaleInfoContent: Maybe<IProfileInfo> = defaultLocaleData;
  setPageSeo(infoContent?.seo);

  const { changeProfileData } = useCoreProfileApi();
  const profileStore = useProfileStore();
  const { profile, userNickname, resentVerifyEmail } = storeToRefs(profileStore);
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const route = useRoute();
  const router = useRouter();

  const isProfileEdit = computed(() => route.query.edit === 'true');
  const userCountryName = computed(() => {
    const countryObject: Maybe<ICountry> = countries.value.find((country) => country.code === profile.value?.country);
    return countryObject?.nativeName || '';
  });

  const receiveBonusField = { isRequired: false, name: 'receiveBonus' };
  const subscriptionFields = computed(() => {
    const receiveFields = profileFields.value.filter((field) => field.name === 'receiveSmsPromo' || field.name === 'receiveEmailPromo');
    return [...receiveFields, receiveBonusField];
  });

  const toggleProfileEdit = ():void => {
    window.scroll(0, 0);
    router.push({ query: { ...route.query, edit: isProfileEdit.value ? undefined : 'true' } });
  };

  const changeSubscription = async (fieldName:string):Promise<void> => {
    const data = await changeProfileData({ [fieldName]: !profile.value?.[fieldName] });
    profileStore.setProfileData(data);
  };
</script>

<style src="~/assets/styles/pages/profile/info.scss" lang="scss" />

