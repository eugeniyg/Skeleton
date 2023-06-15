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
  import { HistoryTabInterface } from '@skeleton/types';

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

<style src="~/assets/styles/components/tab/history/index.scss" lang="scss" />

