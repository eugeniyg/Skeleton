<template>
  <button-base v-show="show" class="btn-ref-promo" @click.prevent="onClick">
    Referral/Promo Code (Optional)<atomic-icon id="arrow-expand-close" />
  </button-base>
</template>

<script setup lang="ts">
  const show = ref<boolean>(true);
  const emit = defineEmits(['show-promo-input']);
  const onClick = (): void => {
    show.value = false;
    emit('show-promo-input');
  };
</script>

<style src="~/assets/styles/components/button/ref-promo.scss" lang="scss" />
