<template>
  <div class="balance-extended" :class="{'is-open': isOpen, 'is-row-mode': isRowMode}">
    <div class="balance-extended__toggle" @click.prevent="toggleOpen">
      <div>
        <span class="balance-extended__toggle-amount">{{ amount }}</span>
        <span class="balance-extended__toggle-value">{{ currency }}</span>
      </div>
      <atomic-icon id="arrow_expand-open"/>
    </div>

    <div class="balance-extended__items">

      <div class="balance-extended__item" v-for="{ title, amount, currency } in demoBalance.items">
        <span class="balance-extended__label">
          <atomic-icon id="wallet"/>
          <span class="balance-extended__title">{{ title }}</span>
        </span>
        <div class="balance-extended__value">
          <span class="balance-extended__amount">{{ checkLength(amount) }}</span>
          <span class="balance-extended__currency">{{ currency }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  const isOpen = ref<boolean>(false);
  const isRowMode = ref<boolean>(false);

  const demoBalance = {
    items: [
      {
        title: 'Real',
        amount: '46956777',
        currency: 'EUR',
      },
      {
        title: 'Bonus',
        amount: '469567',
        currency: 'EUR',
      },
      {
        title: 'Locked',
        amount: '469567',
        currency: 'EUR',
      },
    ],
  };

  const [{ amount, currency }] = demoBalance.items;

  const checkLength = (title:string):string => {
    if (!isRowMode.value && title.length >= 7) isRowMode.value = true;
    return title;
  };

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

    .is-row-mode & {
      flex-direction: column;
    }
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
