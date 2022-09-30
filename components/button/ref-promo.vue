<template>
  <button-base
    class="btn-ref-promo"
    @click.prevent="onClick"
    v-show="show"
  >
    Referral/Promo Code (Optional)<atomic-icon id="arrow_expand-close"/>
  </button-base>
</template>

<script setup lang="ts">
  const show = ref<boolean>(true);
  const emit = defineEmits(['show-promo-input']);
  const onClick = ():void => {
    show.value = false;
    emit('show-promo-input');
  };
</script>

<style lang="scss">
.btn-ref-promo {
  grid-column-gap: rem(4px);
  margin: 0 auto;
  @include font($body-2);
  color: var(--color, var(--gray-300));
  transition: color .2s ease-in-out;

  &:hover {
    --color: var(--yellow-500);
  }

  .icon {
    --color: var(--gray-400);
  }
}
</style>
