<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span
        v-for="{ id, identity, name } in gameCollections"
        :key="id"
        class="item"
        :class="{ 'is-active': $route.query.category === identity }"
        @click="emit('clickCategory', identity)"
      >
        <atomic-icon :id="sortedCategories[identity]" />
        <span>{{ name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections, sortedCategories } = useGamesStore();
</script>

<style lang="scss" src="./style.scss" />
