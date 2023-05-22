<template>
  <div class="promo">
    <div class="header">
      <div class="title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'registration.promo.title') }}
      </div>

      <span class="sub-title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'registration.promo.secondTitle') }}
      </span>

      <span class="sub-title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'registration.promo.additionalTitle') }}
      </span>
    </div>

    <div v-if="advantagesList?.length" class="items">
      <div
        v-for="(advantage, index) in advantagesList"
        :key="index"
        class="item"
      >
        <atomic-icon :id="advantage.icon"/>{{ advantage.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const advantagesList = computed(() => {
    if (popupsData?.registration?.promo?.advantages?.length) return popupsData.registration.promo.advantages;
    return defaultLocalePopupsData?.registration?.promo?.advantages || [];
  });
</script>

<style lang="scss">
.promo {
  padding: var(--padding, #{rem(8px)});
  text-align: center;
  display: grid;
  align-items: center;
  height: 100%;
  width: 100%;
  grid-area: promo;
  background-image: url(@skeleton/assets/img/promo-sm.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  user-select: none;

  @include media(md) {
    background-image: url(@skeleton/assets/img/promo-lg.png);
    --padding: #{rem(88px)} #{rem(32px)} #{rem(38px)} #{rem(32px)};
  }

  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    grid-column-gap: rem(4px);
    position: relative;

    @include media(md) {
      align-self: start;
    }
  }

  .title {
    @include font($heading-4);
    width: 100%;
    color: var(--white);
  }

  .sub-title {
    @include font($heading-6);
    display: flex;
    flex-wrap: wrap;
    grid-gap: rem(4px);
    color: var(--color, var(--yellow-500));
    justify-content: center;
    align-items: center;

    &:first-of-type {
      @include media(md) {
        width: 100%;
        @include upd-font($heading-9);
      }
    }

    &:last-of-type {
      @include upd-font($heading-4);
      --color: var(--white);

      @include media(md) {
        width: 100%;
        @include upd-font($heading-6);
      }
    }
  }

  .icon {
    --color: var(--yellow-500);
  }

  .items {
    display: var(--display, none);
    grid-gap: rem(8px);
    position: relative;

    @include media(md) {
      align-self: end;
      --display: grid;
    }
  }

  .item {
    background-color: var(--gray-900);
    padding: rem(8px) rem(16px);
    display: flex;
    align-items: center;
    grid-gap: rem(8px);
    border-radius: 8px;
    justify-self: center;
    color: var(--white);
  }
}
</style>
