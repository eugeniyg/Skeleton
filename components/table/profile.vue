<template>
  <div class="tb-profile">
    <div v-for="field in profileViewFields" :key="field.name" class="row">
      <div class="th">{{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field.name}.label`) || '' }}</div>

      <div class="td">
        <atomic-row-sex v-if="field.name === 'gender' && profile?.gender" :value="profile?.gender"/>
        <template v-else-if="field.name === 'birthdate'">{{ profile?.[field.name]?.split(' ')[0] || '-' }}</template>
        <template v-else-if="field.name === 'phone'">{{ profile?.[field.name] ? `+${profile?.[field.name]}`: '-' }}</template>
        <div class="tb-profile__email" v-else-if="field.name === 'email'">
          <span class="tb-profile__email-value">{{ profile?.[field.name] || '-' }}</span>

          <atomic-icon v-if="profile?.confirmedAt" class="is-success" id="done"/>
          <atomic-icon v-else class="is-warning" id="warning"/>

          <span
            v-if="!profile?.confirmedAt"
            class="btn-primary size-xs"
            @click.once="profileStore.resendVerifyEmail"
            :class="{ disabled: resentVerifyEmail }"
          >
            {{ infoContent?.sendButton || defaultLocaleInfoContent?.sendButton }}
          </span>
        </div>
        <template v-else>{{ profile?.[field.name] || '-' }}</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {IProfileInfo} from "~/types";

  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));

  const hideFields = [
    'nickname',
    'password',
    'password_confirmation',
    'receiveSmsPromo',
    'receiveEmailPromo',
  ];
  const profileStore = useProfileStore();
  const { profile, resentVerifyEmail } = storeToRefs(profileStore);
  const globalStore = useGlobalStore();
  const { fieldsSettings, defaultLocaleFieldsSettings } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const profileViewFields = computed(() => profileFields.value.filter((field) => !hideFields.includes(field.name)));
</script>

<style src="~/assets/styles/components/table/profile.scss" lang="scss" />

