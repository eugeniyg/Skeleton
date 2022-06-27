<template>
  <div class="alert" :class="classes">
    <atomic-icon :id="currentIcon"/>

    <div class="content">
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <p class="text" v-if="props.text">{{ props.text }}</p>
    </div>

    <button class="btn-alert-close" @click.prevent="hide">
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
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
  });

  const types = {
    info: 'ui-info',
    error: 'ui-warning',
    warning: 'ui-info',
    done: 'ui-done',
  };

  const { hideAlert } = useLayoutStore();

  const timer = ref<any>();

  const setTimer = ():void => {
    timer.value = setTimeout(() => {
      hideAlert();
    }, 5000);
  };

  const hide = ():void => {
    if (props.autoHide) clearTimeout(timer.value);
    hideAlert();
  };

  watch(() => props.isShow, (newValue:boolean) => {
    if (newValue && props.autoHide) {
      setTimer();
    }
  });

  const classes = computed(() => [{
    'is-show': props.isShow,
  }, `variant-${props.variant}`]);

  const currentIcon = computed(() => types[props.variant]);

  onBeforeUnmount(() => {
    clearTimeout(timer.value);
  });
</script>

<style lang="scss" src="./style.scss"/>
