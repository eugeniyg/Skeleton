<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">
        {{ infoContent?.title || defaultLocaleInfoContent?.title }}
      </h1>

      <button-base
        v-if="!isProfileEdit"
        type="secondary"
        size="md"
        @click="toggleProfileEdit"
      >
        <atomic-icon id="edit"/>{{ infoContent?.editButton || defaultLocaleInfoContent?.editButton }}
      </button-base>
    </div>

    <form-profile
      v-if="isProfileEdit && profileFields?.length"
      @toggle-profile-edit="toggleProfileEdit"
    />

    <template v-else>
      <div class="row-user">
        <div class="row-user__info">
          <loyalty-avatar size="lg" class="row-user__info-avatar" />

          <div class="row-user__info-nickname">
            {{ userNickname }}
          </div>

          <loyalty-progress class="row-user__info-progress" showInfo />
        </div>
      </div>

      <quest-hub v-if="showQuestHub" />

      <table-profile />

      <atomic-divider />
    </template>

    <h4 class="heading">
      {{ infoContent?.subscriptionTitle || defaultLocaleInfoContent?.subscriptionTitle }}
    </h4>

    <div class="group">
      <form-input-toggle
        v-for="field in subscriptionFields"
        :key="field.name"
        :name="field.name"
        :value="profile?.[field.name]"
        @change="changeSubscription(field.name)"
      >
        {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) }}
      </form-input-toggle>

      <atomic-divider/>
    </div>

    <h4 class="heading">
      {{ infoContent?.manageTitle || defaultLocaleInfoContent?.manageTitle }}
    </h4>

    <button-base type="ghost" size="md" @click="profileStore.logOutUser">
      <atomic-icon id="log-out"/>{{ layoutData?.profileSidebar?.logoutButton || defaultLocaleLayoutData?.profileSidebar?.logoutButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICountry } from '@skeleton/core/types';
  import type { IProfileInfo } from '~/types';

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
    setPageMeta,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();
  const infoContent = ref<Maybe<IProfileInfo>>();
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>();
  provide('infoContent', infoContent);
  provide('defaultLocaleInfoContent', defaultLocaleInfoContent);

  const runtimeConfig = useRuntimeConfig();
  const showQuestHub = runtimeConfig.public?.questsEnabled;

  interface IPageContent {
    currentLocaleData: Maybe<IProfileInfo>;
    defaultLocaleData: Maybe<IProfileInfo>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    infoContent.value = contentData?.currentLocaleData;
    defaultLocaleInfoContent.value = contentData?.defaultLocaleData;
    setPageMeta(infoContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileInfoContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'info').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'info').findOne()
    ]);

    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileInfoContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });

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

