<template>
  <div class="expander">
    <div class="header" :class="{'is-open': open}" @click="toggle">
      <div class="title">{{ props.title }}</div>

      <button-base>
        <atomic-icon id="arrow_expand-open"/>
      </button-base>
    </div>

    <div class="expander__content" ref="content" :style="styles">
      <atomic-text-editor :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      required: false,
    },
  });

  const open = ref<boolean>(props.isOpen);
  const maxHeight = ref<number>(0);

  const styles = computed(() => ({ '--max-height': open.value ? `${maxHeight.value}px` : '0px' }));
  const content = ref(null);

  const toggle = ():void => {
    open.value = !open.value;
    maxHeight.value = open.value ? content.value.scrollHeight : 0;
  };

  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
    setTimeout(() => {
      maxHeight.value = content.value.scrollHeight;
    }, 100);
  });
</script>

<style lang="scss" src="./style.scss"/>
