<template>
  <div class="qr">
    <div class="title">{{ props.content?.addressTitle }}</div>
    <div class="description">{{ props.content?.addressDescription }}</div>

    <div class="box">
      <atomic-image
        v-if="props.qrAddress"
        :src="`https://chart.googleapis.com/chart?chs=116x116&cht=qr&chl=${props.qrAddress}&choe=UTF-8`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IWalletDeposit } from '~/types';

  const props = defineProps<{
    content: Maybe<IWalletDeposit>,
    qrAddress: string
  }>();
</script>

<style src="~/assets/styles/components/atomic/qr.scss" lang="scss" />
