<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span class="item" :class="{ 'is-active': !$route.query.category }" @click="emit('clickCategory', 'all')">
        <atomic-icon :id="'cherry'"/><span>All Games</span>
      </span>

      <template v-for="({ id, identity, games }, itemIndex) in gameCollections">
        <span
          v-if="games.length"
          :key="id"
          class="item"
          :class="{ 'is-active': $route.query.category === id }"
          @click="emit('clickCategory', id)"
        >
          <atomic-icon :id="icons[itemIndex]"/><span>{{ identity }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();
  const icons = ['hot', 'slots', 'table-games', 'new', 'turbo-games', 'live-casino'];
</script>

<style lang="scss" src="./style.scss"/>
