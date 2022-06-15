<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <span
        class="item"
        :class="{ 'is-active': !$route.query.category }"
        @click="emit('clickCategory', 'all')"
      >
        <atomic-icon :id="'cherry'" /><span>All Games</span>
      </span>
      <template v-for="({ id, identity, games }, itemIndex) in filteredGameCollections">
        <span
          v-if="games.length"
          :key="id"
          class="item"
          :class="{ 'is-active': $route.query.category === identity }"
          @click="emit('clickCategory', identity)"
        >
          <atomic-icon :id="icons[itemIndex] || 'cherry'" /><span>{{
            identity
          }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['clickCategory']);
  const { gameCollections } = useGamesStore();

  const filteredGameCollections = gameCollections.filter(
    (item) => item.identity !== 'all',
  );

  // ['hot', 'new', 'slots', 'popular', 'live', 'table', 'turbo'] - from api
  // ['hot', 'slots', 'turbo', 'new', 'table', 'live', 'popular'] - should be

  [
    filteredGameCollections[1],
    filteredGameCollections[2],
    filteredGameCollections[3],
    filteredGameCollections[4],
    filteredGameCollections[5],
    filteredGameCollections[6],
  ] = [
    filteredGameCollections[2],
    filteredGameCollections[6],
    filteredGameCollections[1],
    filteredGameCollections[5],
    filteredGameCollections[4],
    filteredGameCollections[3],
  ];

  const icons = [
    'hot',
    'slots',
    'turbo-games',
    'new',
    'table-games',
    'live-casino',
    'ui-heart',
  ];
</script>

<style lang="scss" src="./style.scss" />
