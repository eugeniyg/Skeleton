<template>
  <div class="alert" :class="classes">
    <atomic-icon :id="currentIcon"/>

    <div class="content">
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <p class="text" v-if="props.description">{{ props.description }}</p>
    </div>

    <button class="btn-alert-close" @click.prevent="hide">
      <atomic-icon id="close"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
  });

  const types = {
    info: 'info',
    error: 'warning',
    warning: 'info',
    done: 'done',
  };

  const { hideAlert } = useLayoutStore();

  const timer = ref<any>();

  const setTimer = ():void => {
    clearTimeout(timer.value);
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
  }, `variant-${props.type}`]);

  const currentIcon = computed(() => types[props.type]);

  onBeforeUnmount(() => {
    clearTimeout(timer.value);
  });
</script>

<style lang="scss" src="./style.scss"/>
