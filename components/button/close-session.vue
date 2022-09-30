<template>
  <button class="btn-close-session">
    <atomic-icon id="log-out"/>
  </button>
</template>

<style lang="scss">
.btn-close-session {
  @extend %skip-btn;
  @extend %icon-btn;
  --icon-size: #{rem(20px)};

  &:hover {
    cursor: pointer;
  }
}
</style>
