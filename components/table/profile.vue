<template>
  <div class="tb-profile">
    <div v-for="field in profileViewFields" :key="field.name" class="row">
      <div class="th">
        {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || '' }}
      </div>

      <div class="td">
        <atomic-row-sex v-if="field.name === 'gender' && profile?.gender" :value="profile?.gender" />
        <template v-else-if="field.name === 'birthdate'">{{ profile?.[field.name]?.split(' ')[0] || '-' }}</template>
        <template v-else-if="field.name === 'phone'">{{
          profile?.[field.name] ? `+${profile?.[field.name]}` : '-'
        }}</template>
        <div v-else-if="field.name === 'email'" class="tb-profile__email">
          <span class="tb-profile__email-value">{{ profile?.[field.name] || '-' }}</span>

          <template v-if="profile?.email">
            <atomic-icon v-if="profile?.confirmedAt" id="done" class="is-success" />
            <atomic-icon v-else id="warning" class="is-warning" />

            <span
              v-if="!profile?.confirmedAt"
              class="btn-primary size-xs"
              :class="{ disabled: resentVerifyEmail }"
              @click.once="profileStore.resendVerifyEmail"
            >
              {{ infoContent?.sendButton || defaultLocaleInfoContent?.sendButton }}
            </span>
          </template>
        </div>
        <template v-else>{{ profile?.[field.name] || '-' }}</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileInfo } from '~/types';

  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));
  const runtimeConfig = useRuntimeConfig();
  const hiddenFieldsWithLoyalty = [
    'nickname',
    'password',
    'password_confirmation',
    'receiveSmsPromo',
    'receiveEmailPromo',
  ];
  const hiddenFieldsWithoutLoyalty = [
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
  const hiddenFields = runtimeConfig.public?.loyaltyEnabled ? hiddenFieldsWithLoyalty : hiddenFieldsWithoutLoyalty;

  const profileStore = useProfileStore();
  const { profile, resentVerifyEmail } = storeToRefs(profileStore);
  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const profileViewFields = computed(() => profileFields.value.filter(field => !hiddenFields.includes(field.name)));
</script>

<style src="~/assets/styles/components/table/profile.scss" lang="scss" />
