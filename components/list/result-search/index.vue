<template>
  <div class="result-search" :class="{'is-show': props.isShow}">
    <div class="box">
      <div class="items">
        <div
          v-for="({ src, title, isActive }, itemIndex) in filteredItems"
          :key="itemIndex"
          class="item"
          :class="{'is-active': isActive}"
        >
          <img v-if="src" :src="`/img${src}`" />
          <span>{{ title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    search: {
      type: String,
      default: '',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  });

  const items = [
    {
      src: '/search/1.png',
      title: 'AAAAA BBBB CCCC DDDDDDD GGGGGGGGGG MMMMMMMMMMMMMMMMMM hello world',
      isActive: true,
    },
    {
      src: '/search/2.png',
      title: 'AA',
    },
    {
      src: '/search/3.png',
      title: 'B',
      isActive: true,
    },
    {
      src: '/search/4.png',
      title: 'C',
    },
    {
      src: '/search/5.png',
      title: 'd',
    },
    {
      src: '/search/3.png',
      title: 'B',
      isActive: true,
    },
    {
      src: '/search/4.png',
      title: 'C',
    },
    {
      src: '/search/5.png',
      title: 'd',
    },
    {
      src: '/search/1.png',
      title: 'AAAAA BBBB CCCC DDDDDDD GGGGGGGGGG MMMMMMMMMMMMMMMMMM hello world',
    },
    {
      src: '/search/2.png',
      title: 'AA',
    },
    {
      src: '/search/1.png',
      title: 'AAAAA BBBB CCCC DDDDDDD GGGGGGGGGG MMMMMMMMMMMMMMMMMM hello world',
    },
    {
      src: '/search/2.png',
      title: 'AA',
    },
    {
      src: '/search/1.png',
      title: 'AAAAA BBBB CCCC DDDDDDD GGGGGGGGGG MMMMMMMMMMMMMMMMMM hello world',
    },
    {
      src: '/search/2.png',
      title: 'AA',
    },
    {
      src: '/search/1.png',
      title: 'AAAAA BBBB CCCC DDDDDDD GGGGGGGGGG MMMMMMMMMMMMMMMMMM hello world',
    },
    {
      src: '/search/2.png',
      title: 'AA',
    },
  ];
  const filteredItems = computed(() => items.filter((item) => item.title.includes(props.search)));
</script>

<style lang="scss" src="./style.scss"/>
