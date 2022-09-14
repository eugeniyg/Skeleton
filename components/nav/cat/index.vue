<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span
        v-for="{ id, identity, name } in sortedCategories"
        :key="id"
        class="item"
        :class="{ 'is-active': $route.query.category === identity }"
        @click="emit('clickCategory', identity)"
      >
        <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon" />
        <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const { gameCategoriesObj, globalComponentsContent } = useGlobalStore();
  const filteredCategories = gameCollections.filter((collection) => !collection.isHidden).map((category) => {
    const contentArrayIndex = globalComponentsContent.categories?.findIndex((item) => item.identity === category.identity);
    return { ...category, sortIndex: contentArrayIndex < 0 ? undefined : contentArrayIndex };
  });
  const sortedCategories = filteredCategories.sort((prevEl, nextEl) => {
    if (prevEl.sortIndex < nextEl.sortIndex) return -1;
    return 1;
  });
</script>

<style lang="scss" src="./style.scss" />
