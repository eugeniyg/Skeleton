<template>
  <div ref="rootElement" class="socials-telegram" />
</template>

<script setup lang="ts">
  import type { ICoreConstants } from '@skeleton/api/types';

  const props = defineProps<{
    params: ICoreConstants['player']['telegram'];
  }>();

  const rootElement = ref();

  // TELEGRAM DOCS: https://core.telegram.org/widgets/login
  onMounted(() => {
    if (!props.params) return;
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', 'https://telegram.org/js/telegram-widget.js?22');
    script.setAttribute('data-telegram-login', props.params.bot);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', props.params.auth_url);
    script.setAttribute('data-request-access', 'write');

    rootElement.value.appendChild(script);
  });
</script>
