<template>
  <div class="expander-item">
    <div class="header" :class="{'is-open': open}" @click="toggle">
      <div class="title" v-html="props.title"/>

      <button-base>
        <atomic-icon id="ui-arrow_expand-open"/>
      </button-base>
    </div>

    <div
      class="content"
      v-html="raw"
      ref="content"
      :style="styles"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
    },
    content: {
      type: Array,
    },
    isOpen: {
      type: Boolean,
    },
  });
  const open = ref<boolean>(props.isOpen);
  const maxHeight = ref<number>(0);

  const styles = computed(() => ({ '--max-height': open.value ? `${maxHeight.value}px` : '0px' }));
  const raw = computed(() => props.content.join(''));

  const content = ref(null);
  const toggle = ():void => {
    open.value = !open.value;
    maxHeight.value = open.value ? content.value.scrollHeight : 0;
  };
  onMounted(() => {
    maxHeight.value = content.value.scrollHeight;
  });
</script>

<style lang="scss" src="./style.scss"/>
