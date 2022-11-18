<template>
  <div v-if="benefitsContent" class="group-benefits">
    <div class="group-benefits__list">
      <div
        class="group-benefits__item"
        v-for="(benefit, index) in benefitsContent.items"
        :key="index"
      >
        <img class="icon" :src="benefit.image" alt=""/>
        <h2 class="title" v-html="marked.parse(benefit.title)"/>
        <div class="text" v-html="marked.parse(benefit.text)"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { BenefitsContentInterface } from '~/types';

  const { globalComponentsContent } = useGlobalStore();
  const benefitsContent: BenefitsContentInterface | undefined = globalComponentsContent?.benefits;
</script>

<style lang="scss">
.group-benefits {

  @include media(xxxl) {
    max-width: rem(464px);
  }

  &__list {
    display: var(--display, grid);
    flex-wrap: wrap;
    align-items: normal;
    grid-template-columns: repeat(2, 1fr);
    height: 100%;
    grid-gap: rem(16px);

    @include media(md) {
      grid-template-columns: repeat(4, 1fr);
    }

    @include media(xxl) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__item {
    background-color: var(--gray-900);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(2, auto);
    position: relative;
    padding: rem(16px) rem(8px) rem(16px) rem(16px);
    align-content: center;
    align-items: center;
    grid-row-gap: rem(4px);

    .icon {
      width: var(--width, #{rem(64px)});
      height: var(--height, #{rem(64px)});
      display: block;
      justify-self: center;
      grid-column: 2;
      grid-row: 1/3;
      align-self: center;
    }

    .title {
      @include font($heading-2);
      color: var(--white);
      grid-column: 1;
      margin: 0;
      grid-row: 1/3;
      word-break: break-word;
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);

      p {
        margin: 0;
      }

      @include media(xs) {
        br {
          content: ''
        }
      }

      @include media(md) {
        grid-row: 1;
        align-self: flex-end;
      }
    }

    .text {
      @include font($body-1);
      color: var(--gray-300);
      grid-column: 1;
      display: none;
      align-self: flex-start;

      p {
        margin: 0;
      }

      @include media(md) {
        display: block;
        grid-row: 2/3;
      }
    }
  }
}
</style>
