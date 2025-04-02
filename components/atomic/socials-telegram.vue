<template>
  <div ref="rootElement" class="socials-telegram" />
</template>

<script setup lang="ts">
  const rootElement = ref();

  onMounted(() => {
    const locationOrigin = window.location.origin;
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', 'https://telegram.org/js/telegram-widget.js?22');
    script.setAttribute('data-telegram-login', 'ogtestauth_bot');
    script.setAttribute('data-size', 'small');
    script.setAttribute('data-auth-url', `${locationOrigin}/api/player/sessions/social/telegram/redirect`);
    script.setAttribute('data-request-access', 'write');

    rootElement.value.appendChild(script);
  });
</script>
