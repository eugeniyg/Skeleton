<template>
  <div class="tabs-history">
    <div class="nav">
      <div
        class="item"
        v-for="{ title, id } in tabsArray"
        :key="id"
        :class="{'is-selected': id === selected}"
        @click="changeTab(id)"
      >
        {{ title }}
      </div>
    </div>

    <div class="tab-history">
      <component :content="props.content" :is="loadTab(selected)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { HistoryTabInterface } from '~/types';

  const props = defineProps<{
    content: HistoryTabInterface
  }>();

  const filterContent = Object.keys(props.content).filter((key) => {
    if (props.content[key]?.tabLabel) return key;
    return false;
  });

  const sortContent = filterContent.sort((a, b) => {
    if (props.content[a].tabPosition > props.content[b].tabPosition) return 1;
    return -1;
  });

  const tabsArray = sortContent.map((key) => ({
    id: key,
    title: props.content[key].tabLabel,
  }));

  const selected = ref<string>(tabsArray[0].id);

  const route = useRoute();
  const router = useRouter();

  if (route.query.tab) {
    selected.value = route.query.tab as string;
  } else {
    router.replace({ query: { tab: tabsArray[0].id } });
  }

  const loadTab = (name:string):string => `tab-history-${name}`;

  const changeTab = (tabId: string):void => {
    router.push({ query: { tab: tabId } });
    selected.value = tabId;
  };
</script>

<style lang="scss">
.tabs-history {
  overflow: hidden;

  > .nav {
    display: flex;
    align-items: center;
    grid-column-gap: rem(24px);
    border-bottom: 1px solid var(--gray-700);
    @extend %scrollbar-hide;
    overflow-x: auto;
    margin-bottom: 24px;

    > .item {
      color: var(--color, var(--gray-400));
      @include font($heading-2);
      position: relative;
      padding: rem(10px) 0;
      transition: color .2s ease-in-out;
      user-select: none;
      cursor: var(--cursor, pointer);
      white-space: nowrap;

      &:after {
        content: '';
        display: block;
        height: 2px;
        border-radius: 1px;
        position: absolute;
        background-color: var(--border-color, transparent);
        left: var(--left, 50%);
        right: var(--right, 50%);
        bottom: 0;
        transition: all .2s ease-in-out;
      }

      &.is-selected {
        --color: var(--white);
        --border-color: var(--yellow-500);
        --left: 0;
        --right: 0;
        --cursor: text;
      }
    }
  }

  .pagination {
    margin-top: rem(24px);
  }
}
</style>
