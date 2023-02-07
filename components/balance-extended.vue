<template>
  <div class="balance-extended" :class="{'is-open': isOpen}">
    <div class="balance-extended__toggle" @click.prevent="toggleOpen">
      <div>
        <span class="balance-extended__toggle-amount">469567</span>
        <span class="balance-extended__toggle-value">EUR</span>
      </div>
      <atomic-icon id="arrow_expand-open"/>
    </div>

    <div class="balance-extended__items">

      <div class="balance-extended__item">
        <span class="balance-extended__label">
          <atomic-icon id="wallet"/>
          <span class="balance-extended__title">Real</span>
        </span>
        <div class="balance-extended__value">
          <span class="balance-extended__amount">469567</span>
          <span class="balance-extended__currency">EUR</span>
        </div>
      </div>

      <div class="balance-extended__item">
        <span class="balance-extended__label">
          <atomic-icon id="bonus"/>
          <span class="balance-extended__title">Bonus</span>
        </span>
        <div class="balance-extended__value">
          <span class="balance-extended__amount">469567</span>
          <span class="balance-extended__currency">EUR</span>
        </div>
      </div>

      <div class="balance-extended__item">
        <span class="balance-extended__label">
          <atomic-icon id="locked"/>
          <span class="balance-extended__title">Locked</span>
        </span>
        <div class="balance-extended__value">
          <span class="balance-extended__amount">469567</span>
          <span class="balance-extended__currency">EUR</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  const isOpen = ref<boolean>(false);

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };
</script>

<style lang="scss">
.balance-extended {
  &.is-open {
    --max-height: 100vh;
  }

  &__toggle {
    display: flex;
    align-items: center;
    grid-column-gap: 4px;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    margin-bottom: 8px;

    .is-open & {
      .icon {
        --color: var(--yellow-500);
        --rotate: rotate(0);
      }
    }

    div {
      display: flex;
      grid-column-gap: 4px;
      align-items: center;
    }

    &-amount, &-value {
      @include font($heading-2);
      color: var(--color, var(--white));
      transition: color .4s ease-in-out;

      .is-open & {
        --color: var(--yellow-500);
      }
    }

    .icon {
      transform: var(--rotate, rotate(180deg));
      --color: var(--gray-400);
      --icon-size: 16px;
    }
  }

  &__items {
    overflow: hidden;
    display: none;
    background-color: var(--gray-850);
    border-radius: 8px;
    grid-row-gap: 12px;
    padding: 12px;

    .is-open & {
      display: grid;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &__label {
    color: var(--gray-300);
    @include font($body-1);
    line-height: 1;
    display: flex;
    align-items: center;
    grid-gap: 4px;

    .icon {
      --color: var(--gray-400);
      --icon-size: 16px;
    }
  }

  &__value {
    display: flex;
    align-items: center;
    grid-column-gap: 4px;
    color: var(--white);
    @include font($heading-1);
  }
}
</style>
