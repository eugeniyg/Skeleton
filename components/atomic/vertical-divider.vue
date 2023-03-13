<template>
  <span class="vertical-divider"></span>
</template>

<style lang="scss">
.vertical-divider {
  margin-left: 12px;
  margin-right: 2px;
  height: rem(40px);
  border-left: 1px solid var(--gray-800);

  @include media(l) {
    display: none;
  }
}
</style>
