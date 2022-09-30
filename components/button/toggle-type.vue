<template>
  <span class="btn-toggle-type" @click.prevent="toggle">
    <atomic-icon :id="icon"/>
  </span>
</template>

<script setup lang="ts">
  const items = {
    text: 'eye-visibility',
    password: 'eye-invisible',
  };
  const hide = ref<boolean>(true);
  const type = computed(() => Object.keys(items)[Number(hide.value)]);
  const icon = computed(() => Object.values(items)[Number(hide.value)]);

  const emit = defineEmits(['change-type']);
  const toggle = ():void => {
    hide.value = !hide.value;
    emit('change-type', type.value);
  };
</script>

<style lang="scss">
.btn-toggle-type {
  @extend %skip-btn;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 16px;
  padding: 0;
  top: 0;
  bottom: 0;
  width: rem(28px);

  .icon {
    width: rem(20px);
    height: rem(20px);
    --color: var(--gray-400);
  }

  &:hover {
    cursor: pointer;

    .icon {
      --color: var(--white);
    }
  }
}
</style>
