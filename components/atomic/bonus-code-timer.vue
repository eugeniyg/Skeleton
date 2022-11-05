<template>
  <div class="bonus-code-timer">
    <atomic-icon id="history"/>
    <div class="time">
      <span class="value">2</span>
      <span class="title">m</span>
      <span class="sep"></span>
      <span class="value">88</span>
      <span class="title">s</span>
    </div>
    <div class="message">until the next try</div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.bonus-code-timer {
  display: flex;
  align-items: center;
  grid-column-gap: rem(4px);
  color: var(--white);
  margin: rem(24px) auto rem(16px);
  justify-content: center;
  user-select: none;

  .icon {
    --color: var(--gray-400);
  }

  .time {
    @include font($heading-2);
    display: flex;
    align-items: center;
  }

  .message {
    @include font($body-2);
  }

  .value, .title, .sep {
    display: block;
  }

  .sep {
    width: rem(4px);
    background: red;
  }

}
</style>
