<template>
  <button class="btn-edit" @click.prevent>
    <atomic-icon id="edit"/>
  </button>
</template>

<style lang="scss">
.btn-edit {
  @extend %skip-btn;
  @extend %link;
  @extend %icon-btn;

  &:hover {
    cursor: pointer;
  }
}
</style>
