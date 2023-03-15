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
    content: Maybe<DepositInterface>,
    qrLink: string
  }>();
</script>

<style lang="scss">
.qr {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "title box"
    "description box";
  grid-row-gap: rem(8px);
  grid-column-gap: rem(16px);

  .title {
    @include font($heading-2);
    color: var(--white);
    grid-area: title;
  }

  .description {
    @include font($body-2);
    color: var(--gray-400);
    grid-area: description;
  }

  .box {
    grid-area: box;
    width: 116px;
    height: 116px;
    background-color: var(--white);
    border-radius: 8px;
    align-self: flex-start;
    overflow: hidden;
  }
}
</style>
