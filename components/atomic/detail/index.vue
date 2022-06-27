<template>
  <div class="detail" :class="{ 'is-open': state.open }" @resize="updateScrollHeight">
    <div class="header" @click="toggleOpen">
      <div class="title">{{ title }}</div>
      <atomic-icon id="ui-arrow_expand-close"/>
    </div>
    <div class="items" ref="items">
      <ol>
        <template v-for="(item, itemIndex) in items">
          <li v-if="!Array.isArray(item)" :key="itemIndex">{{ item }}</li>
          <ul v-else>
            <li v-for="(item, itemIndex) in item" :key="itemIndex">
              {{ item }}
            </li>
          </ul>
        </template>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const state = reactive({
    open: props.isOpen,
    scrollHeight: 0,
  });

  const toggleOpen = ():void => {
    state.open = !state.open;
    const height = state.open ? state.scrollHeight : 0;
    this.$refs.items.style.setProperty('--items-height', `${height}px`);
  };

  const updateScrollHeight = ():void => {
    state.scrollHeight = this.$refs.items.scrollHeight;
  };

  onMounted(() => updateScrollHeight());
</script>

<style lang="scss" src="./style.scss"></style>
