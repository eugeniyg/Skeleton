<template>
  <div v-if="showComponent" class="socials">
    <div class="socials__title">
      {{ componentTitle }}
    </div>
    
    <div class="socials__items">
      <span
        v-for="connection in socialConnections"
        :key="connection"
        class="socials__item"
        :class="`socials__item--${connection}`"
        @click="authSocial(connection)"
      >
        <atomic-icon :id="connection === 'google-oauth2' ? 'google' : connection" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import queryString from 'query-string';
  import { storeToRefs } from "pinia";

  const props = defineProps<{
    type: 'login'|'registration';
  }>()

  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const componentTitle = computed(() => {
    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      `socialAuth.${props.type}Title`
    );
  })

  const { $auth0 } = useNuxtApp();
  const socialConnections = computed(() => {
    const connectionList: { id: string }[] = getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'socialAuth.connections'
    ) || [];
    return connectionList.map(connection => connection.id);
  })

  const showComponent = computed(() => !!$auth0 && !!socialConnections.value.length);

  const authSocial = (connection: string) => {
    if (!$auth0) return;

    useAnalyticsEvent('registration', {
      event: 'registrationChangeType',
      regType: 'social'
    })

    const { query, path } = useRoute();
    const formedQuery = queryString.stringify({
      ...query,
      'sign-in': undefined,
      'sign-up': undefined,
      'stag': undefined
    });
    const affiliateTag = localStorage.getItem('affiliateTag');

    $auth0.loginWithRedirect({
      appState: {
        type: props.type,
        affiliateTag: affiliateTag,
        targetUrl: formedQuery ? `${path}?${formedQuery}` : path
      },
      authorizationParams: {
        connection
      }
    });
  }
</script>

<style src="@skeleton/assets/styles/components/atomic/socials.scss" lang="scss"/>
