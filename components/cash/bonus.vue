<template>
  <div
    class="cash-bonus"
    :class="{
      [`cash-bonus--bg-${props.background}`]: props.background,
      'is-selected': props.selected
    }"
  >
    <div class="cash-bonus__content">
      <div class="cash-bonus__title" v-html="marked.parse(props.title)"/>
      
      <div class="cash-bonus__min" v-if="props.min" @click="showModal('bonusDetails')">
        <atomic-icon id="info"/>
        <div class="cash-bonus__min-title">Min. Deposit:</div>
        <div class="cash-bonus__min-value">{{ props.min }}</div>
      </div>
      <div v-else class="cash-bonus__more" @click="showModal('bonusDetails')">
        <div class="cash-bonus__more-title">More info</div>
        <atomic-icon id="info"/>
      </div>
      
      <form-input-checkbox :value="props.selected"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const { showModal } = useLayoutStore();
  
  const props = defineProps({
    background: {
      type: String,
      required: false,
      validator: (val: string) => ['red', 'orange', 'green', 'violet'].includes(val)
    },
    title: {
      type: String,
      required: true,
    },
    min: {
      type: String,
      required: false,
    },
    info: {
      type: String,
      required: false,
    },
    selected: {
      type: Boolean
    },
  });
</script>

<style src="~/assets/styles/components/cash/bonus.scss" lang="scss"/>