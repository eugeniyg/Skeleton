<template>
  <notifications :position="isMobile ? 'bottom center' : 'top right'" :duration="8000" :speed="200" :width="328">
    <template #body="{ item, close }">
      <div class="alert" :class="`variant-${item.type}`">
        <atomic-icon :id="types[item.type]" />

        <div class="content">
          <div v-if="item.title" class="title">
            {{ item.title }}
          </div>
          <p v-if="item.text" v-router-links class="text" v-html="item.text || ''" />
        </div>

        <button class="btn-alert-close">
          <atomic-icon id="close" @click="close" />
        </button>
      </div>
    </template>
  </notifications>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { isMobile } = storeToRefs(globalStore);
  const types: { [index: string]: string } = {
    info: 'info',
    error: 'warning',
    warning: 'info',
    done: 'done',
    pending: 'clock',
  };
</script>

<style src="~/assets/styles/components/atomic/alert.scss" lang="scss" />
