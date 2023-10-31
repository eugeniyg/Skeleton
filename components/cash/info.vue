<template>
  <div class="cash-info">
    <div class="cash-info__icon">
      <atomic-icon id="info"/>
    </div>
    <div class="cash-info__text" v-html="marked.parse(text)"/>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const text = '<p>Note: If a transaction is made in a different network than required, your deposit will be lost</p>'
</script>

<style src="~/assets/styles/components/cash/info.scss" lang="scss" />

