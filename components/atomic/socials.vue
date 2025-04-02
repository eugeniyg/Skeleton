<template>
  <div v-if="showComponent" class="socials">
    <div class="socials__title">
      {{ componentTitle }}
    </div>

    <div class="socials__items">
      <span
        v-for="connection in socialDirectConnections"
        :key="`direct-${connection}`"
        class="socials__item"
        :class="`socials__item--${connection}`"
        @click="authSocial('direct', connection)"
      >
        <template v-if="connection === 'telegram'">
          <atomic-socials-telegram :params="settingsTelegramParams" />
          <atomic-icon id="telegram" />
        </template>
        <atomic-icon v-else :id="connection" />
      </span>

      <span
        v-for="connection in socialAuth0Connections"
        :key="`auth0-${connection}`"
        class="socials__item"
        :class="`socials__item--${connection}`"
        @click="authSocial('auth0', connection)"
      >
        <atomic-icon :id="connection" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import queryString from 'query-string';

  const props = defineProps<{
    type: 'login' | 'registration';
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, settingsConstants } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const componentTitle = computed(() => {
    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      `socialAuth.${props.type}Title`
    );
  });

  const settingsSocialAuthList = settingsConstants.value?.player?.socialAuth || [];
  const settingsTelegramParams = settingsConstants.value?.player?.telegram;
  const socialAuth0Connections = computed(() => {
    if (!settingsSocialAuthList.includes('auth0')) return [];

    const currentLocaleAuth0Connections = globalComponentsContent.value?.socialAuth?.socialAuth0Connections || [];
    const defaultLocaleAuth0Connections =
      defaultLocaleGlobalComponentsContent.value?.socialAuth?.socialAuth0Connections || [];

    const connectionList = currentLocaleAuth0Connections.length
      ? currentLocaleAuth0Connections
      : defaultLocaleAuth0Connections;

    return connectionList.map(connection => connection.id);
  });

  const socialDirectConnections = computed(() => {
    const currentLocaleDirectConnections = globalComponentsContent.value?.socialAuth?.socialDirectConnections || [];
    const defaultLocaleDirectConnections =
      defaultLocaleGlobalComponentsContent.value?.socialAuth?.socialDirectConnections || [];

    const connectionList = currentLocaleDirectConnections.length
      ? currentLocaleDirectConnections
      : defaultLocaleDirectConnections;

    return connectionList
      .map(connection => connection.id)
      .filter(connection => {
        const connectionEnabled = settingsSocialAuthList.includes(connection);
        if (connection === 'telegram') {
          return connectionEnabled && settingsTelegramParams?.bot && settingsTelegramParams?.auth_url;
        }
        return connectionEnabled;
      });
  });

  const showComponent = computed(() => socialAuth0Connections.value.length || socialDirectConnections.value.length);

  const authSocial = (type: 'direct' | 'auth0', connection: string) => {
    useEvent('analyticsEvent', {
      event: 'registrationChangeType',
      regType: 'social',
    });

    const { query, path } = useRoute();
    const backQuery = queryString.stringify({
      ...query,
      'sign-in': undefined,
      'sign-up': undefined,
      stag: undefined,
    });

    const locationOrigin = window.location.origin;
    const backRoute = backQuery ? `${path}?${backQuery}` : path;
    const authState = { backRoute: encodeURIComponent(backRoute) };
    const stateParam = new URLSearchParams(`state=${JSON.stringify(authState)}`);
    const authUrl =
      type === 'auth0'
        ? `/api/player/sessions/social/auth0/redirect?${stateParam}&connection=${connection}`
        : `/api/player/sessions/social/${connection}/redirect?${stateParam}`;
    window.location.href = `${locationOrigin}${authUrl}`;
  };
</script>

<style src="@skeleton/assets/styles/components/atomic/socials.scss" lang="scss" />
