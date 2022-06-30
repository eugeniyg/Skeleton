<template>
  <div class="detail" :class="{ 'is-open': open }" @resize="updateScrollHeight">
    <div class="header" @click="toggleOpen">
      <div class="title">{{ props.title }}</div>
      <atomic-icon id="ui-arrow_expand-close" />
    </div>
    <div class="items" ref="refItems">
      <ol>
        <template v-for="(item, itemIndex) in props.items">
          <li v-if="!Array.isArray(item)" :key="`li-${itemIndex}`">{{ item }}</li>
          <ul v-else :key="`ul-${itemIndex}`">
            <li v-for="listItem in item" :key="`list-${listItem}`">{{ listItem }}</li>
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

  const open = ref<boolean>(props.isOpen);
  const scrollHeight = ref<number>(0);
  const refItems = ref();

  const toggleOpen = (): void => {
    open.value = !open.value;
    const height = open.value ? scrollHeight.value : 0;
    refItems.value.style.setProperty('--items-height', `${height}px`);
  };

  const updateScrollHeight = (): void => {
    scrollHeight.value = refItems.value.scrollHeight;
  };
  onMounted(() => {
    setTimeout(() => {
      updateScrollHeight();
    }, 100);
  });
</script>

<style lang="scss" src="./style.scss"></style>
