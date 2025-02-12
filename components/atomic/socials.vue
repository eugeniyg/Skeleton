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
        <atomic-icon :id="connection" />
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
  const socialAuth0Connections = computed(() => {
    if (!settingsSocialAuthList.includes('auth0')) return [];

    const connectionList: { id: string }[] =
      getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'socialAuth.socialAuth0Connections'
      ) || [];
    return connectionList.map(connection => connection.id);
  });

  const socialDirectConnections = computed(() => {
    const connectionList: { id: string }[] =
      getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'socialAuth.socialDirectConnections'
      ) || [];
    return connectionList
      .map(connection => connection.id)
      .filter(connection => settingsSocialAuthList.includes(connection));
  });

  const showComponent = computed(() => socialAuth0Connections.value.length || socialDirectConnections.value.length);

  const authSocial = (type: 'direct' | 'auth0', connection: string) => {
    useEvent('analyticsEvent', {
      event: 'registrationChangeType',
      regType: 'social',
    });

    const locationOrigin = window.location.origin;
    const redirectUrl =
      type === 'auth0'
        ? `/api/player/sessions/social/auth0/redirect?connection=${connection}`
        : `/api/player/sessions/social/${connection}/redirect`;
    window.location.href = `${locationOrigin}${redirectUrl}`;
  };
</script>

<style src="@skeleton/assets/styles/components/atomic/socials.scss" lang="scss" />
