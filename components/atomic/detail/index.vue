<template>
  <div class="detail" :class="{ 'is-open': open }" @resize="updateScrollHeight">
    <div class="header" @click="toggleOpen">
      <div class="title">{{ props.title }}</div>
      <atomic-icon id="ui-arrow_expand-close" />
    </div>
    {{ props.items }}
    <br />
    <br />
    {{ scrollHeight }}
    <div class="items" ref="refItems">
      <ol>
        <template v-for="(item, itemIndex) in props.items">
          <li v-if="!Array.isArray(item)" :key="itemIndex">{{ item }}</li>
          <ul v-else>
            <li v-for="item in item" :key="item">{{ item }}</li>
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

  const updateScrollHeight = async (): Promise<void> => {
    console.log('53 ->', refItems.value);

    await nextTick();

    scrollHeight.value = refItems.value.scrollHeight;
  };

  onMounted(async () => updateScrollHeight());
</script>

<style lang="scss" src="./style.scss"></style>
