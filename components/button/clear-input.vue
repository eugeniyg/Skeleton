<template>
  <button class="btn-clear-input" @click.prevent="clickAction">
    <atomic-icon id="close"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clear-input']);
  const clickAction = () => emit('clear-input');
</script>

<style lang="scss">
.btn-clear-input {
  @include box(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-left: auto;

  @extend %skip-btn;
  --color: var(--gray-400);

  .icon {
    --icon-size: 16px;
    --color: #718792;
  }

  &:hover {
    cursor: pointer;

    .icon {
      --color: var(--white);
    }
  }
}
</style>
