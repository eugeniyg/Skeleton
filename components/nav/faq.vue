<template>
  <nav class="nav-faq" :class="{ 'is-open': isOpen }">
    <button class="selected" @click="toggle">
      {{ selected?.title }}
      <atomic-icon id="arrow_expand-close" />
    </button>

    <div class="items" @mouseleave="close">
      <div
        v-for="(item, itemIndex) in props.items"
        :key="itemIndex"
        class="item"
        :class="{ 'is-active': route.path === localizePath(`/questions/${item.pageIdentity}`) }"
        @click.prevent="select(`/questions/${item.pageIdentity}`)"
      >
        <atomic-icon :id="item.icon" />{{ item.title }}
        <atomic-icon v-show="route.path === localizePath(`/questions/${item.pageIdentity}`)" id="check" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import type { IQuestionCategory } from '~/types';

  const props = defineProps<{
    items: IQuestionCategory[];
  }>();
  const isOpen = ref<boolean>(false);
  const route = useRoute();
  const selected = computed(() =>
    props.items.find((item: any) => localizePath(`/questions/${item.pageIdentity}`) === route.path)
  );

  const toggle = (): void => {
    isOpen.value = !isOpen.value;
  };

  const close = (): void => {
    isOpen.value = false;
  };

  const router = useRouter();
  const select = (val: string) => {
    router.push(localizePath(val));
    close();
  };
</script>

<style src="~/assets/styles/components/nav/faq.scss" lang="scss" />
