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
        <atomic-icon v-if="gameCategoriesObj[identity]?.icon" :id="gameCategoriesObj[identity].icon" />
        <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const { gameCategoriesObj } = useGlobalStore();
</script>

<style lang="scss" src="./style.scss" />
