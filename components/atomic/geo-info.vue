<template>
  <div v-if="headerCountry && headerIp" class="geo-info">
    <atomic-image class="geo-info__flag" :src="`/img/flags/${headerCountry.toLowerCase()}.svg`" />
    <span class="geo-info__country">{{ headerCountry }}</span>
    <span class="geo-info__ip">{{ headerIp }}</span>
  </div>
</template>

<script setup lang="ts">
  const globalStore = useGlobalStore();
  const { headerCountry, headerIp } = storeToRefs(globalStore);
</script>

<style src="~/assets/styles/components/atomic/geo-info.scss" lang="scss" />
