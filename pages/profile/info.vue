<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ infoContent?.title }}</h1>

      <button-base
        v-if="!isProfileEdit"
        type="secondary"
        size="md"
        @click="toggleProfileEdit"
      >
        <atomic-icon id="edit"/>{{ infoContent?.editButton }}

        <!--        <template v-if="isProfileEdit">-->
        <!--          <atomic-icon id="done"/>Done editing-->
        <!--        </template>-->

        <!--        <template v-else>-->
        <!--          <atomic-icon id="edit"/>Edit your profile-->
        <!--        </template>-->
      </button-base>
    </div>

    <client-only>
      <form-profile
        v-if="isProfileEdit"
        @toggle-profile-edit="toggleProfileEdit"
        v-bind="infoContent"
      />

      <template v-else>
        <div class="row-user">
          <atomic-avatar-profile :is-edit="false"/>

          <div class="items">
            <div class="nickname">{{ userNickname }}</div>

            <div class="item" v-show="profile.firstName || profile.lastName">
              <atomic-icon id="user"/>
              {{ `${profile.firstName} ` }}{{ profile.lastName }}
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
                {{ infoContent?.sendButton }}
              </span>
            </div>
          </div>
        </div>

        <table-profile/>

        <atomic-divider/>
      </template>

      <template v-if="subscriptionFields.length">
        <h4 class="heading">{{ infoContent?.subscriptionTitle }}</h4>

        <div class="group">
          <form-input-toggle
            v-for="field in subscriptionFields"
            :key="field.name"
            :name="field.name"
            :value="profile[field.name]"
            @change="changeSubscription(field.name)"
          >
            {{ fieldsContent?.[field.name]?.label }}
          </form-input-toggle>

          <atomic-divider/>
        </div>
      </template>
    </client-only>

    <h4 class="heading">{{ infoContent?.manageTitle }}</h4>

    <button-base type="ghost" size="md" @click="profileStore.logOutUser">
      <atomic-icon id="log-out"/>{{ userNavigationContent?.logoutButton }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CountryInterface } from '@platform/frontend-core/dist/module';
  import { ProfileInfoInterface } from '~/types';

  const globalStore = useGlobalStore();
  const infoContentRequest = await useAsyncData('infoContent', () => queryContent(`profile/${globalStore.currentLocale.code}`).only(['info']).findOne());
  const infoContent:ProfileInfoInterface|undefined = infoContentRequest.data.value?.info;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(infoContent?.seo);

  const { changeProfileData } = useCoreProfileApi();
  const profileStore = useProfileStore();
  const { profile, userNickname, resentVerifyEmail } = storeToRefs(profileStore);
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const {
    countries, fieldsContent, userNavigationContent,
  } = storeToRefs(globalStore);
  const route = useRoute();
  const router = useRouter();

  const isProfileEdit = computed(() => route.query.edit === 'true');
  const userCountryName = computed(() => {
    const countryObject:CountryInterface|undefined = countries.value.find((country) => country.code === profile.value.country);
    return countryObject?.nativeName || '';
  });
  const subscriptionFields = computed(() => profileFields.value.filter((field) => field.name === 'receiveSmsPromo' || field.name === 'receiveEmailPromo'));

  const toggleProfileEdit = ():void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    router.push({ query: { ...route.query, edit: isProfileEdit.value ? undefined : 'true' } });
  };

  const changeSubscription = async (fieldName:string):Promise<void> => {
    const data = await changeProfileData({ [fieldName]: !profile.value[fieldName] });
    profileStore.setProfileData(data);
  };
</script>

<style lang="scss">
.row-user {
  display: flex;
  flex-direction: column;
  grid-row-gap: rem(24px);

  @include media(md) {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "avatar";
    grid-column-gap: rem(24px);
  }

  .items {
    display: flex;
    flex-direction: column;
    grid-row-gap: rem(4px);
    @include font($body-3);
  }

  .item {
    display: flex;
    grid-column-gap: rem(4px);
    color: var(--white);

    .btn-primary {
      margin-left: var(--margin-left-btn, auto);

      @include media(md) {
        --margin-left-btn: #{rem(8px)};
      }

      &.disabled {
        pointer-events: none;
        --bg: var(--yellow-900);
        --color: var(--black-primary);
      }
    }
  }

  .nickname {
    @include font($heading-4);
    color: var(--white);
    margin-bottom: rem(4px);
  }

  .icon {
    --color: var(--gray-400);
    --icon-size: #{rem(20px)};

    &.is-warning {
      --color: var(--orange-500);
    }

    &.is-success {
      --color: var(--green-500);
    }
  }
}
</style>
