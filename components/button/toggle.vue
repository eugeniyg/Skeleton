<template>
  <button :class="classes" @click="onClick">
    <atomic-icon id="arrow_expand-close"/>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const classes = computed(() => ({
    'btn-toggle': true,
    'is-active': props.isActive,
  }));

  const emit = defineEmits(['toggle']);
  function onClick():void {
    emit('toggle');
  }
</script>

<style lang="scss">
.btn-toggle {
  @include box(24px);
  @extend %flex-all-center;
  @extend %skip-btn;
  border-radius: 8px;
  padding: 0;
  transition: all .2s ease-in-out;
  transform: rotate(var(--deg, 0));
  margin-left: var(--margin-left, 0);

  &:hover {
    cursor: pointer;
  }

  &:active, &.is-active, .is-open &  {
    --bg: var(--gray-700);
    --color: var(--yellow-500);
    --deg: -180deg;
  }
}
</style>
