<template>
  <div class="not-auth-game" :class="modeClassName">
    <div class="title" v-if="props.title">{{ props.title }}</div>

    <img
      class="img"
      :src="props.image"
      width="104"
      height="104"
      alt=""
    />

    <p class="text">{{ props.description }}</p>

    <div class="actions">
      <button-base
        type="primary"
        :size="modeBtnSize"
        @click="showModal('register')"
      >
        {{ headerContent?.registrationButton || defaultLocaleHeaderContent?.registrationButton }}
      </button-base>

      <button-base
        type="secondary"
        :size="modeBtnSize"
        @click="showModal('signIn')"
      >
        {{ headerContent?.loginButton || defaultLocaleHeaderContent?.loginButton }}
      </button-base>
    </div>

    <!-- TPBE-1644
    <div class="actions">
      <button-base type="primary" size="lg">
        <atomic-icon id="play" />
        Registration
      </button-base>

      <button-base
        type="secondary"
        size="lg"
      >
        Demo
      </button-base>
    </div>
    -->
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title?: string,
    image: string,
    description: string,
    singleMode?: boolean
  }>();

  const modeClassName = computed(() => ({ 'is-single-mode': props.singleMode }));
  const modeBtnSize = computed(() => (props.singleMode ? 'md' : 'lg'));
  const { showModal } = useLayoutStore();
  const { headerContent, defaultLocaleHeaderContent } = useGlobalStore();
</script>

<style src="~/assets/styles/components/not-auth-game.scss" lang="scss" />

