<template>
  <div>
    <!--
    <div class="nav-tabs">
      <div
        class="nav-tabs__item"
        v-for="{ title, id } in tabs"
        :key="id"
        :class="{'is-active': id === selectedTab}"
        @click="changeTab(id)"
      >
        {{ title }}
      </div>
    </div>

    <table-bonuses-history :items="bonusesHistoryTb"/>

    -->

    <atomic-empty variant="bonuses" sub-title="You have not received bonuses yet."/>
  </div>
</template>

<script setup lang="ts">
  const { bonusesHistoryTb } = useFakeStore();

  const tabs = [
    {
      title: 'Cash Bonuses',
      id: 'cash-bonuses',
    },
    {
      title: 'Free spins',
      id: 'free-spins',
    },
  ];

  const selectedTab = ref<string>(tabs[0].id);

  const changeTab = (tabId: string): void => {
    if (selectedTab.value === tabId) return;
    selectedTab.value = tabId;
  };
</script>

<style lang="scss">
.nav-tabs {
  display: flex;
  background-color: var(--gray-800);
  border: 4px solid var(--gray-800);
  border-radius: 12px;
  margin-bottom: 16px;

  &__item {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 32px;
    @include font($body-1);
    padding: rem(2px);
    border-radius: 8px;
    background-color: var(--bg, inherit);
    color: var(--color, inherit);
    transition: all .2s ease-in-out;
    grid-column-gap: rem(4px);
    --color: var(--gray-300);

    &:hover {
      cursor: pointer;
    }

    &.is-active {
      --bg: var(--gray-700);
      --color: var(--white) !important;
    }
  }
}

.tb-bonuses-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  padding-bottom: rem(8px);

  .row {
    grid-template-columns:
      minmax(rem(156px), 1fr)
      minmax(rem(105px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(75px), 1fr)
      minmax(rem(100px), 1fr)
      minmax(rem(100px), 1fr);
  }
}
</style>
