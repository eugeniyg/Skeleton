<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}
      </h1>

      <button-base v-if="!isProfileEdit" type="secondary" size="md" @click="toggleProfileEdit">
        <atomic-icon id="edit" />{{ getContent(currentLocaleContent, defaultLocaleContent, 'editButton') }}
      </button-base>
    </div>

    <form-profile v-if="isProfileEdit && profileFields?.length" @toggle-profile-edit="toggleProfileEdit" />

    <template v-else>
      <div class="row-user">
        <div v-if="loyaltyEnabled" class="row-user__info">
          <loyalty-avatar size="lg" class="row-user__info-avatar" />

          <div class="row-user__info-nickname">
            {{ userNickname }}
          </div>

          <atomic-external-id />

          <loyalty-progress class="row-user__info-progress" show-info />
        </div>

        <template v-else>
          <loyalty-avatar size="lg" />

          <div class="items">
            <div class="nickname">{{ userNickname }}</div>
            
            <atomic-external-id />

            <div v-show="profile?.firstName || profile?.lastName" class="item">
              <atomic-icon id="user" />
              {{ profile?.firstName }} {{ profile?.lastName }}
            </div>

            <div v-show="profile?.country || profile?.city" class="item">
              <atomic-icon id="location" />
              {{ userCountryName }}{{ profile?.city ? `, ${profile?.city}` : '' }}
            </div>

            <div v-show="hasEmailField && profile?.email" class="item">
              <atomic-icon v-if="profile?.confirmedAt" id="done" class="is-success" />
              <atomic-icon v-else id="warning" class="is-warning" />
              {{ profile?.email }}

              <span
                v-if="!profile?.confirmedAt"
                class="btn-primary size-xs"
                :class="{ disabled: resentVerifyEmail }"
                @click.once="profileStore.resendVerifyEmail"
              >
                {{ getContent(currentLocaleContent, defaultLocaleContent, 'sendButton') }}
              </span>
            </div>
          </div>
        </template>
      </div>

      <quest-hub v-if="showQuestHub" />

      <table-profile />

      <atomic-divider />
    </template>

    <h4 class="heading">
      {{ getContent(currentLocaleContent, defaultLocaleContent, 'subscriptionTitle') }}
    </h4>

    <div class="group">
      <form-input-toggle
        v-for="field in subscriptionFields"
        :key="field.name"
        :name="field.name"
        :value="profile?.[field.name]"
        :loading="subscriptionLoading.includes(field.name)"
        @change="changeSubscription(field.name)"
      >
        {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) }}
      </form-input-toggle>

      <atomic-divider />
    </div>

    <h4 class="heading">
      {{ getContent(currentLocaleContent, defaultLocaleContent, 'manageTitle') }}
    </h4>

    <button-base type="ghost" size="md" @click="profileStore.logOutUser">
      <atomic-icon id="log-out" />{{
        layoutData?.profileSidebar?.logoutButton || defaultLocaleLayoutData?.profileSidebar?.logoutButton
      }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICountry } from '@skeleton/core/types';
  import type { IProfileInfo } from '~/types';

  const globalStore = useGlobalStore();
  const { countries, fieldsSettings, defaultLocaleFieldsSettings, layoutData, defaultLocaleLayoutData } =
    storeToRefs(globalStore);

  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'profileInfoContent',
    contentRoute: ['profile', 'info'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileInfo>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);

  provide('infoContent', currentLocaleContent);
  provide('defaultLocaleInfoContent', defaultLocaleContent);

  const runtimeConfig = useRuntimeConfig();
  const showQuestHub = runtimeConfig.public?.questsEnabled;
  const loyaltyEnabled = runtimeConfig.public?.loyaltyEnabled;
  const { changeProfileData } = useCoreProfileApi();
  const profileStore = useProfileStore();
  const { profile, userNickname, resentVerifyEmail } = storeToRefs(profileStore);
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const route = useRoute();
  const router = useRouter();

  const isProfileEdit = computed(() => route.query.edit === 'true');
  const userCountryName = computed(() => {
    const countryObject: Maybe<ICountry> = countries.value.find(country => country.code === profile.value?.country);
    return countryObject?.nativeName || '';
  });

  const receiveBonusField = { isRequired: false, name: 'receiveBonus' };
  const subscriptionFields = computed(() => {
    const receiveFields = profileFields.value.filter(
      field => field.name === 'receiveSmsPromo' || field.name === 'receiveEmailPromo'
    );
    return [...receiveFields, receiveBonusField];
  });

  const hasEmailField = computed(() => {
    return profileFields.value.some(field => field.name === 'email');
  });

  const toggleProfileEdit = (): void => {
    window.scroll(0, 0);
    router.push({ query: { ...route.query, edit: isProfileEdit.value ? undefined : 'true' } });
  };

  const subscriptionLoading = ref<string[]>([]);
  const changeSubscription = async (fieldName: string): Promise<void> => {
    if (subscriptionLoading.value.includes(fieldName)) return;

    subscriptionLoading.value = [...subscriptionLoading.value, fieldName];
    try {
      const data = await changeProfileData({ [fieldName]: !profile.value?.[fieldName] });
      profileStore.setProfileData(data);
    } catch {
      console.error('Subscription update error!');
    }
    subscriptionLoading.value = subscriptionLoading.value.filter(field => field !== fieldName);
  };
</script>

<style src="~/assets/styles/pages/profile/info.scss" lang="scss" />
