<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span class="item" :class="{ 'is-active': !$route.query.category }" @click="emit('clickCategory', 'all')">
        <atomic-icon :id="'cherry'"/><span>All Games</span>
      </span>

      <span
        v-for="({ id, identity }, itemIndex) in gameCollections"
        :key="id"
        class="item"
        :class="{ 'is-active': $route.query.category === id }"
        @click="emit('clickCategory', id)"
      >
        <atomic-icon :id="icons[itemIndex] || 'cherry'"/><span>{{ identity }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const icons = ['hot', 'slots', 'table-games', 'new', 'turbo-games', 'live-casino'];
</script>

<style lang="scss" src="./style.scss"/>
