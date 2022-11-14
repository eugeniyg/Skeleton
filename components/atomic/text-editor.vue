<template>
  <div class="text-editor" v-html="marked.parse(props.content)" />
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const props = defineProps<{content: string}>();
</script>

<style lang="scss">
.text-editor {
  @include text-page-max;
  color: var(--white);

  i, em {
    @include font($body-1);
    color: var(--gray-400);
    display: block;
  }

  h1 {
    @include font($heading-7);
    margin: 0 0 rem(8px);
  }

  h2, h3, h4, h5, h6 {
    color: var(--color, var(--white));
    @include font($heading-5);
  }

  h2, h3, h4, h5, h6 {
    margin: rem(24px) 0 rem(16px);
  }

  a {
    color: var(--yellow-500);
  }

  dl {
    display: grid;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    @include font($body-1);
    grid-column-gap: rem(8px);
    color: var(--gray-400);

    dt {
      grid-column: 1;
    }

    dd {
      grid-column: 2;
      margin: 0;
    }
  }

  ol {
    padding: 0;
    margin: rem(12px) 0;
    list-style-position: inside;

    ul, ol {
      padding-left: rem(20px);
    }

    li {
      color: var(--gray-400);
      margin: rem(12px) 0;
    }
  }

  ul {
    list-style: disc;
    padding: 0;
    margin: rem(12px) 0;
    list-style-position: inside;

    ul, ol {
      padding-left: rem(20px);
    }

    li {
      color: var(--gray-400);
      margin: rem(12px) 0;
    }
  }

  li {
    &::marker {
      display: block;
      margin-right: rem(8px);
    }

    p {
      display: inline;
      font: inherit;
    }
  }

  p {
    @include font($body-3-paragraph);
    color: var(--color, var(--gray-400));
    margin: rem(12px) 0;
  }

  b {
    @include font($heading-3);
  }

  li {
    h2, h3, h4, h5, h6 {
      @include upd-font($heading-3);
    }
  }

  img {
    display: block;
    max-width: 100%;
    margin: rem(12px) 0;
    border-radius: 16px;
  }

  table {
    table-layout: fixed;
    text-align: left;
    width: 100%;

    tr:not(:first-of-type):nth-of-type(odd) {
      background: var(--gray-900);
    }
  }

  th {
    @include font($heading-2);
    color: var(--gray-400);
    border-bottom: 1px solid var(--gray-700);
    padding: rem(16px);
  }

  td {
    @include font($body-2);
    padding: rem(16px);
  }

  article {
    background-color: var(--gray-900);
    padding: rem(16px);

    h2, h3, h4, h5, h6 {
      @include upd-font($heading-3);
    }

    p {
      @include upd-font($body-3);
      --color: var(--white);
    }
  }
}
</style>
