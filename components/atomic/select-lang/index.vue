<template>
  <div class="select-lang" :class="{ 'is-open': isOpen }">
    <div class="selected" @click="toggleOpen">
      <img class="img" :src="`/img${selected.src}`" alt="" />
      <span class="title">{{ selected.title }}</span>
      <atomic-icon id="ui-arrow_expand-close" />
    </div>
    <div class="items">
      <div
        class="item"
        v-for="{ src, title, value } in props.items"
        :key="title"
        :class="{ 'is-selected': selected.value === value }"
        @click="select(value)"
      >
        <img class="img" :src="`/img${src}`" alt="" />
        <span class="title">{{ title }}</span>
        <atomic-icon id="ui-check" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const state = reactive({
    selected: 'en',
  });

  const props = defineProps({
    items: {
      type: Array,
      default: () => [
        {
          value: 'en',
          title: 'English',
          src: '/flags/en.png',
        },
        {
          value: 'de',
          title: 'German',
          src: '/flags/de.png',
        },
        {
          value: 'jp',
          title: 'Japanese',
          src: '/flags/jp.png',
        },
      ],
    },
  });

  onMounted(() => {
    const storageLang = localStorage.getItem('lang');

    if (storageLang) {
      state.selected = storageLang;
    }
  });

  const isOpen = ref<boolean>(false);

  const selected = computed(
    () => props.items.find((item) => item.value === state.selected),
  );

  const toggleOpen = (): void => {
    isOpen.value = !isOpen.value;
  };

  const select = (value: string): void => {
    state.selected = value;
    localStorage.setItem('lang', value);
    toggleOpen();
  };
</script>

<style lang="scss" src="./style.scss"></style>
