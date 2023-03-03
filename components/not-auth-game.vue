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

<style lang="scss">
.not-auth-game {
  display: flex;
  justify-items: center;
  justify-content: center;
  flex-direction: column;
  padding: rem(16px);
  margin: 0 auto;
  width: 100%;
  align-items: center;
  height: 100%;

  @include media(l) {
    min-height: 60vh;
    background-color: var(--black-primary);

    &:not(.is-single-mode) {
      background-color: var(--gray-900);
      border: 1px solid var(--gray-800);
    }
  }

  img {
    display: block;
    max-width: 100%;
    margin-bottom: rem(16px);
    width: var(--image-width, #{rem(106px)});
    height: auto;
  }

  &.is-single-mode img {
    --image-width: #{rem(328px)};

    @include media(md) {
      --image-width: #{rem(458px)};
    }
  }

  .title {
    @include font($heading-6);
    color: var(--white);
    text-align: center;
    margin-bottom: rem(16px);
  }

  .text {
    margin: 0;
    @include font($body-3);
    color: var(--white);
    text-align: center;
    max-width: 320px;
  }

  &.is-single-mode .text {
    @include upd-font($heading-4);
    max-width: 480px;

    @include media(md) {
      @include upd-font($heading-5);
    }
  }

  .actions {
    margin-top: rem(24px);
    display: flex;
    grid-column-gap: rem(8px);
  }
}
</style>
