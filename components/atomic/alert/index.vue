<template>
  <div class="alert" :class="classes">
    <atomic-icon :id="currentIcon"/>
    <div class="content">
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <p class="text" v-if="props.text">{{ props.text }}</p>
    </div>
    <button class="btn-alert-close" @click.prevent="show = false">
      <atomic-icon id="ui-close"/>
    </button>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['info', 'error', 'warning', 'done'].includes(val),
      default: 'info',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
  });

  const types = {
    info: 'ui-info',
    error: 'ui-warning',
    warning: 'ui-info',
    done: 'ui-done',
  };
  const show = ref<boolean>(props.isShow);
  const classes = computed(() => [{
    'is-show': show.value,
  }, `variant-${props.variant}`]);
  const currentIcon = computed(() => types[props.variant]);
</script>

<style lang="scss" src="./style.scss"/>
