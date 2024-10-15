<template>
  <div class="verification content">
    <div class="header">
      <h1 class="heading">
        {{ currentLocaleContent?.title || defaultLocaleContent?.title }}
      </h1>
    </div>

    <div v-if="hasEmailField || hasPhoneRegistration" class="verification__profile">
      <verification-email v-if="hasEmailField" />
      <verification-phone v-if="hasPhoneRegistration" />
    </div>

    <verification-sumsub v-if="sumsubIntegrated" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {IProfileVerification} from '~/types';

  const globalStore = useGlobalStore();
  const { settingsConstants } = storeToRefs(globalStore);
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const hasEmailField = computed(() => {
    return !!profileFields.value.find(field => field.name === 'email');
  })
  const hasPhoneRegistration = computed(() => settingsConstants.value?.player.registration.phone);

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IProfileVerification>({
    contentKey: 'profileVerificationContent',
    contentRoute: ['profile', 'verification'],
    isPage: true
  });

  provide('verificationContent', currentLocaleContent);
  provide('defaultLocaleVerificationContent', defaultLocaleContent);

  const runtimeConfig = useRuntimeConfig();
  const sumsubIntegrated = runtimeConfig.public.sumsub?.enabled;
</script>
