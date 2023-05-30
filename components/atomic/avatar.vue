<template>
  <div
    class="avatar"
    @click="emit('toggle')"
  >
    <span v-if="props.isButton" class="close-decor">
      <atomic-icon id="plus"/>
    </span>

    <span class="thumb">
      <img class="img" src="/img/avatar-bg.png" alt="">
      <atomic-bulb v-if="props.showBulb"/>
    </span>

    <span v-if="props.label" class="label">
      {{ props.label }}
    </span>

    <span v-if="props.nickname" class="nickname">
      {{ props.nickname }}
    </span>

    <slot name="progress-bar"/>

    <span v-if="props.amount.length" class="amount">
      <span v-for="(item, index) in props.amount" :key="index">
        {{ item }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    showBulb: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '',
    },
    amount: {
      type: Array,
      default: () => [],
    },
    isButton: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['toggle']);
</script>

<style src="~/assets/styles/components/atomic/avatar.scss" lang="scss" />
