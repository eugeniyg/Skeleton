<template>
  <button type="button" class="btn-clear-input">
    <atomic-icon id="close"/>
  </button>
</template>

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
