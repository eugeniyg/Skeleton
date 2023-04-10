<template>
  <div class="fiat-toggler">
    <div class="fiat-toggler__label">Display in Fiat</div>

    <transition name="fade">
      <div class="fiat-toggler__selected" v-if="isChecked" @click="showModal('fiat')">
        <img class="fiat-toggler__selected-logo" :src="`/img/currency/${selectedCurrencyCode}.svg`" alt=""/>
        <span class="fiat-toggler__selected-currency">{{ selectedCurrencyCode }}</span>
      </div>
    </transition>

    <form-input-toggle
      v-model:value="isChecked"
      @change="toggle"
      name="fiat"
    />
  </div>
</template>

<script setup lang="ts">
  const layoutStore = useLayoutStore();
  const { showModal, showFiatDisplay, hideFiatDisplay } = layoutStore;

  const isChecked = ref<string | null | boolean>(false);
  const selectedCurrencyCode = ref('USD');

  const toggle = () => {
    isChecked.value = !isChecked.value;
    nextTick(() => {
      isChecked.value ? showFiatDisplay() : hideFiatDisplay();
    });
  };

  onMounted(() => {
    isChecked.value = localStorage.getItem('SHOW_FIAT_DISPLAY');
  });
</script>

<style lang="scss">
.fiat-toggler {
  display: flex;
  align-items: center;
  padding-top: rem(16px);
  border-top: 1px solid var(--gray-700);
  margin-top: rem(8px);

  &__label {
    @include font($heading-1);
    @extend %text-elipsis;
    color: var(--white);
    flex-grow: 1;
  }

  &__selected {
    height: rem(24px);
    display: flex;
    align-items: center;
    column-gap: rem(4px);
    padding: 0 rem(8px);
    background-color: var(--layer-02);
    border-radius: 8px;
    margin-right: rem(4px);

    &-logo {
      display: block;
      @include box(16px);

    }

    &-currency {
      @include font($heading-1);
      color: var(--yellow-500);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
