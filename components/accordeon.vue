<template>
  <div class="accordeon" :class="classes">
    <div class="header">
      <slot name="header" :heading="props.heading" />
      <button-toggle :is-active="state" @toggle="toggle" />
    </div>

    <div ref="content" class="content" :style="heightStyle">
      <slot v-for="(item, index) in props.items" :key="index" name="content" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      validator: (val: string) => ['toggle', 'expand'].includes(val),
      default: 'toggle',
    },
    heading: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  });

  const state = ref<boolean>(props.isOpen);
  const closedHeight = ref<number>(0);
  const openHeight = ref<number>(0);

  const classes = computed(() => ({
    'is-open': state.value,
    [`mode-${props.mode}`]: true,
  }));
  const heightStyle = computed(() => `--height: ${state.value ? openHeight.value : closedHeight.value}px`);

  function toggle(): void {
    state.value = !state.value;
  }

  const content = ref<HTMLElement>();
  onMounted(() => {
    openHeight.value = content.value?.scrollHeight || 0;
  });
</script>

<style src="~/assets/styles/components/accordeon.scss" lang="scss" />
