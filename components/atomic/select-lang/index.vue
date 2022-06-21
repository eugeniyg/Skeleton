<template>
  <div class="select-lang" :class="{'is-open': isOpen}">
    <div class="selected" @click="toggleOpen">
      <img class="img" :src="`/img${selected.src}`" alt="" />
      <span class="title">{{ selected.title }}</span>
      <atomic-icon id="ui-arrow_expand-close" />
    </div>
    <div class="items">
      <div
        class="item"
        v-for="{src, title, value} in props.items"
        :key="title"
        :class="{'is-selected': selected.value === value}"
        @click="select(value)"
      >
        <img class="img" :src="`/img${src}`" alt=""/>
        <span class="title">{{ title }}</span>
        <atomic-icon id="ui-check" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  const props = defineProps({
    selected: {
      type: String,
      default: 'en',
    },
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

  const selectedValue = ref<string>(props.selected);
  const isOpen = ref<boolean>(false);

  const selected = computed(() => props.items.filter((item) => (item.value === selectedValue.value))[0]);

  const toggleOpen = ():void => {
    isOpen.value = !isOpen.value;
  };

  const select = (value):void => {
    selectedValue.value = value;
    toggleOpen();
  };
</script>

<style lang="scss" src="./style.scss"></style>
