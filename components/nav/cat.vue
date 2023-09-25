<template>
  <div class="nav-cat-scroll">
    <div class="nav-cat-wrap" ref="viewport">
      <div class="nav-cat">
        <span
          v-for="({ id, identity, name }, index) in filteredCategories"
          class="nav-cat-item"
          :data-index="index"
          :class="{
            'is-active': $route.query.category === identity,
            'is-hidden': index >= visibleIndex.length,
            'is-no-icon': !gameCategoriesObj[identity]?.icon
          }"
          @click="emit('clickCategory', identity)"
          :key="id"
        >
          <atomic-icon :id="gameCategoriesObj[identity]?.icon"/>
          <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
        </span>

        <span
          class="nav-cat-select"
          v-click-outside="close"
          :class="{
            'is-hidden' : isSelectHidden,
            'is-open': isOpen,
          }"
          ref="select"
          @click="toggle"
        >
          <atomic-icon id="more-menu"/>
          <span>All categories</span>
          <atomic-icon class="icon-expand" id="arrow_expand-close"/>

          <span
            class="nav-cat-select-items"
          >
            <span
              v-for="({ id, identity, name }, index) in filteredCategories"
              :key="id"
              class="nav-cat-select-item"
              :class="{
                'is-active': $route.query.category === identity,
                'is-hidden':  index < visibleIndex.length,
              }"
              @click="emit('clickCategory', identity)"
            >
              <atomic-icon :id="gameCategoriesObj[identity]?.icon"/>
              <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
              <atomic-icon v-if="$route.query.category === identity" id="check"/>
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { currentLocationCollections } = useGamesStore();
  const { gameCategoriesObj } = useGlobalStore();
  const filteredCategories = currentLocationCollections.filter((collection) => !collection.isHidden);

  const viewport = ref<HTMLElement>();
  const select = ref<HTMLElement>();

  const isOpen = ref<boolean>(false);
  const isSelectHidden = ref<boolean>(false);
  const visibleIndex = ref<any[]>([]);
  const timeoutId = ref<any>();

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    if (isOpen.value) isOpen.value = false;
  };

  const getItemsData = () => {
    const offset = 8;
    return [...document.querySelectorAll('.nav-cat-item')]
      .map((item:any) => item.offsetWidth + offset)
      .reduce((acc, curr) => {
        acc.totalWidth += curr;
        acc.width.push(acc.totalWidth);
        return acc;
      }, {
        totalWidth: 0,
        width: [],
      });
  };

  const update = () => {
    const viewportWidth = viewport.value?.offsetWidth || 0;
    const toggleWidth = select.value?.offsetWidth || 0;
    const { width, totalWidth } = getItemsData();

    visibleIndex.value = width.filter((item: any) => item < viewportWidth - toggleWidth || viewportWidth > totalWidth);

    isSelectHidden.value = visibleIndex.value.length === width.length;
  };

  const onResize = () => {
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(update, 250);
  };

  onMounted(() => {
    update();
    window.addEventListener('resize', onResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
  });

</script>

<style src="~/assets/styles/components/nav/cat.scss" lang="scss" />
