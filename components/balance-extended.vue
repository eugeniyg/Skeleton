<template>
  <div class="balance-extended">
    <div class="balance-extended__toggle" :class="{'is-open': isOpen}" @click.prevent="toggleOpen">
      <div>
        <span class="balance-extended__toggle-amount">469567</span>
        <span class="balance-extended__toggle-value">EUR</span>
      </div>
      <atomic-icon id="ui-arrow_expand-open"/>
    </div>

    <div class="balance-extended__items">

      <div class="balance-extended__item">
        <span class="balance-extended__label">
          <atomic-icon id="wallet"/>
          <span class="balance-extended__title">Real</span>
        </span>
        <div class="balance-extended__value">
          <span class="balance-extended__amount"></span>
        </div>
      </div>

      <div class="balance-extended__item">
        <span class="balance-extended__label">
          <atomic-icon id="bonus"/>
          <span class="balance-extended__title">Bonus</span>
        </span>
      </div>

      <div class="balance-extended__item">
        <span class="balance-extended__label">
          <atomic-icon id="locked"/>
          <span class="balance-extended__title">Locked</span>
        </span>
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
  &__select {}
  &__label {}
}
</style>
