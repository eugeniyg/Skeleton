<template>
  <div class="not-auth-game" :class="modeClassName">
    <div v-if="props.title" class="title">{{ props.title }}</div>

    <atomic-image class="img" :src="props.image" width="104" height="104" />

    <p class="text">{{ props.description }}</p>

    <div class="actions">
      <button-base type="primary" :size="modeBtnSize" @click="openModal('sign-up')">
        {{ layoutData?.header?.registrationButton || defaultLocaleLayoutData?.header?.registrationButton }}
      </button-base>

      <button-base type="secondary" :size="modeBtnSize" @click="openModal('sign-in')">
        {{ layoutData?.header?.loginButton || defaultLocaleLayoutData?.header?.loginButton }}
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
    title?: string;
    image: string;
    description: string;
    singleMode?: boolean;
  }>();

  const modeClassName = computed(() => ({ 'is-single-mode': props.singleMode }));
  const modeBtnSize = computed(() => (props.singleMode ? 'md' : 'lg'));
  const { openModal } = useModalStore();
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
</script>

<style src="~/assets/styles/components/not-auth-game.scss" lang="scss" />
