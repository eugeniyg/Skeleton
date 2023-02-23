<template>
  <div class="limits">
    <div class="limits__header">
      <h1 class="limits__heading">Limits</h1>
      <div class="limits__mode">
        <span class="limits__mode-label">Advanced mode</span>
        <form-input-toggle
          name="toggle"
          :value="isChecked"
          @change="clickToggle"
        />
      </div>
    </div>

    <div class="limits__grid">
      <div class="limits__card">
        <h2 class="limits__card-title">Deposit limits</h2>
        <p class="limits__card-sub-title">This setting limits the amount you can deposit per day, week or month</p>
        <button-base type="primary">Add new</button-base>
      </div>

      <div class="limits__card">
        <h2 class="limits__card-title">Loss limits</h2>
        <p class="limits__card-sub-title">This setting limits the amount you can lose per day, week or month.</p>
        <button-base type="primary">Add new</button-base>
      </div>

      <div class="limits__card">
        <h2 class="limits__card-title">Wager limits</h2>
        <p class="limits__card-sub-title">This setting limits the amount you can deposit per day, week or month</p>
        <button-base type="primary">Add new</button-base>
      </div>

      <div class="limits__card">
        <h2 class="limits__card-title">Wager limits</h2>
        <p class="limits__card-sub-title">This setting limits the amount you can deposit per day, week or month</p>
        <button-base type="primary">Add new</button-base>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  const isChecked = ref<boolean>(false);
  const clickToggle = () => {
    isChecked.value = !isChecked.value;
  };
</script>

<style lang="scss">
.limits {
  width: 100%;

  &__header {
    margin: rem(8px) 0 rem(24px);

    @include media(sm) {
      display: flex;
      justify-content: space-between;
      grid-column-gap: rem(8px);
    }
  }

  &__heading {
    @include font($heading-6);
    color: var(--white);
    margin: 0;
  }

  &__mode {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
    justify-content: space-between;

    &-label {
      @include font($body-2);
      color: var(--gray-400);
    }
  }

  &__grid {
    display: grid;
    grid-gap: rem(16px);

    @include media(l) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__card {
    padding: rem(24px);
    background-color: var(--gray-900);
    border-radius: 16px;

    &-title {
      @include font($heading-4);
      color: var(--white);
      margin: 0;
      text-align: center;
    }

    &-sub-title {
      @include font($body-1-paragraph);
      color: var(--gray-400);
      margin: 0;
      text-align: center;
    }

    > .btn-primary {
      @include font($heading-2);
      margin: rem(24px) auto 0;
      --padding: 7px 20px;
    }
  }
}
</style>
