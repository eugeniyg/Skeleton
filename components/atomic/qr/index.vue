<template>
  <div class="qr">
    <div class="title">{{ props.content?.addressTitle }}</div>
    <div class="description">{{ props.content?.addressDescription }}</div>

    <div class="box">
      <img
        v-if="props.qrLink"
        :src="`https://chart.googleapis.com/chart?chs=116x116&cht=qr&chl=${props.qrLink}&choe=UTF-8`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DepositInterface } from '~/types';

  const props = defineProps<{
    content: DepositInterface|undefined,
    qrLink: string
  }>();
</script>

<style lang="scss" src="./style.scss"/>
