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
        {{ headerContent?.registrationButton }}
      </button-base>

      <button-base
        type="secondary"
        :size="modeBtnSize"
        @click="showModal('signIn')"
      >
        {{ headerContent?.loginButton }}
      </button-base>
    </div>
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
  const { headerContent } = useGlobalStore();
</script>

<style lang="scss" src="./style.scss"></style>
