<template>
  <div
    v-if="globalComponentsContent?.turbogames?.items?.length && globalComponentsContent?.turbogames?.isShow"
    class="group-turbo"
  >
    <atomic-icon
      v-if="globalComponentsContent?.turbogames?.icon"
      :id="globalComponentsContent?.turbogames?.icon || ''"
    />

    <h2 class="title">
      {{ globalComponentsContent?.turbogames?.label }}
    </h2>

    <button-base
      class="btn-show-all"
      type="ghost"
      size="sm"
      :url="globalComponentsContent?.turbogames?.showAll?.url"
    >
      {{ globalComponentsContent?.turbogames?.showAll?.label }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div
      ref="scrollContainer"
      class="items"
      @scroll="scrollHandler"
    >
      <card-turbo
        v-for="(item, itemIndex) in gamesList"
        :key="itemIndex"
        v-bind="item"
        :buttonLabel="globalComponentsContent?.turbogames?.buttonLabel || ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { globalComponentsContent } = useGlobalStore();

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(true);

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth / 1.4 : -offsetWidth / 1.4,
      behavior: 'smooth',
    });
  };

  const gamesList = computed(() => {
    return globalComponentsContent?.turbogames?.items?.length ? globalComponentsContent.turbogames.items : [];
  });

  onMounted(() => {
    scrollHandler();
    showArrowButtons.value = !prevDisabled.value || !nextDisabled.value;
  });
</script>

<style src="~/assets/styles/components/group/turbo.scss" lang="scss" />

