<template>
  <div class="msg" :class="{'is-unread': props.isUnread}">
    <div class="content">
      <img class="img" :src="props.src" />
      <div class="title">{{ props.title }}</div>
      <div class="date">{{ props.date }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    isUnread: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'Please, verify your email due to security reasons',
    },
    date: {
      type: String,
      default: 'May 14, 2019 • 19:00',
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
