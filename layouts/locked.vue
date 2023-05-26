<template>
  <div class="locked">
    <img class="locked__logo" src="/img/logo-light.svg" alt="">
    <img class="locked__media" src="/img/locked.png" alt=""/>

    <h2 class="locked__title">Country blocked</h2>
    <h4 class="locked__sub-title">Sorry, but players from your country are not allowed to visit Slotsbet.io.</h4>

    <div class="locked__support">
      <h3 class="locked__support-title">Get in touch</h3>
      <h4 class="locked__support-sub-title">If you have questions please contact</h4>
      <a href="mailto:support@slotsbet.io" class="locked__support-mail-to">support@slotsbet.io</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { setPageSeo } = useProjectMethods();
  setPageSeo({});
</script>

<style lang="scss">
.locked {
  padding: var(--padding, #{rem(24px)} #{rem(16px)});
  display: grid;
  justify-content: center;
  justify-items: center;
  min-height: 100vh;
  align-items: flex-start;
  align-content: flex-start;

  @include media(md) {
    --padding: #{rem(44px)} #{rem(16px)};
  }

  &__logo {
    width: rem(136x);
    height: rem(24px);
    display: block;
    margin-bottom: var(--margin-bottom, #{rem(38px)});

    @include media(md) {
      --margin-bottom: #{rem(82px)};
    }
  }

  &__media {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  &__title {
    @include font($heading-5);
    color: var(--white);
    margin: 0 0 rem(8px);

    @include media(md) {
      @include font($heading-7);
    }
  }

  &__sub-title {
    @include font($body-2);
    color: var(--gray-400);
    margin: 0 0 rem(24px);
  }

  &__support {
    padding: rem(16px);
    background-color: var(--gray-900);
    box-shadow: 0 0 12px 0 #00000029;
    display: flex;
    justify-items: center;
    flex-wrap: wrap;
    justify-content: center;
    grid-column-gap: rem(4px);

    &-title {
      @include font($heading-2);
      color: var(--gray-400);
      margin: 0 0 rem(4px);
      width: 100%;
      text-align: center;
    }

    &-sub-title {
      @include font($body-1);
      color: var(--gray-400);
      margin: 0;
      width: var(--width, 100%);
      text-align: center;

      @include media(md) {
        --width: auto;
      }
    }

    &-mail-to {
      @include font($body-1);
      color: var(--yellow-500);
      margin: 0;
    }
  }
}
</style>
