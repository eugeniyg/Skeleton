<template>
  <div class="tab-bonuses">
    <nuxt-link class="link-bonus" to="history?tab=bonuses">See your bonuses history</nuxt-link>

    <tab-bonuses-my-bonuses/>
  </div>
</template>

<style lang="scss">
.tab-bonuses {
  .link-bonus {
    @include font($body-2);
    color: var(--yellow-500);
    text-decoration: none;
    display: flex;
    width: fit-content;
    margin-top: -16px;
    grid-column-gap: rem(4px);
    align-items: center;
    min-height: rem(22px);

    .icon {
      color: var(--yellow-500);
    }
  }

  display: grid;
  color: var(--white);
  grid-row-gap: rem(24px);
}
</style>
