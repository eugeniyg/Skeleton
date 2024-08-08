<template>
  <div class="activity-board">
    <div class="activity-board__header">
      <atomic-icon v-if="props.icon" :id="props.icon" class="activity-board__header-icon"/>
      <div class="activity-board__header-title">{{ props.title }}</div>

      <div
        v-click-outside="hideNav"
        class="activity-board__nav"
        :class="{'is-open': isOpen}"
      >
        <div
          class="activity-board__nav-selected"
          @click="toggleMobileNav"
        >
          <span>{{ selectedNavTitle }}</span>
          <atomic-icon id="arrow_expand-close"/>
        </div>

        <div class="activity-board__nav-items">
          <div
            v-for="{id, title} in boards"
            :key="id"
            class="activity-board__nav-item"
            :class="{'is-active': id === selectedNavItem}"
            @click="selectNavItem(id)"
          >
            <span>{{ title }}</span>
            <atomic-icon v-if="id === selectedNavItem" id="check"/>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-board__tb">
      <div class="activity-board__tb-head">
        <span
          v-for="(title, index) in tbColumns"
          class="activity-board__tb-th"
          :class="`th-${index + 1}`"
        >
          {{ title }}
        </span>
      </div>
      <div
        class="activity-board__tb-body animate"
        :class="{'push': isAnimate}"
        @animationend="onAnimationEnd"
      >
        <div
          v-for="row in tbRows"
          class="activity-board__tb-row"
        >
          <div
            v-for="(td, key, index) in row"
            class="activity-board__tb-td"
            :class="`td-${index + 1}`"
          >
            <template v-if="key === 'game'">
              <atomic-image :src="td.src" class="activity-board__tb-td-img"/>
              <span>{{ td.name }}</span>
            </template>

            <template v-else-if="key === 'amount' || key === 'payout'">
              <atomic-image class="activity-board__tb-td-icon" :src="`/img/currency/${td.currencyCode}.svg`"/>
              <span :class="{'is-accented': td?.isAccented}">{{ td.amount }}</span>
            </template>

            <template v-else>
              <span>{{ td }}</span>
            </template>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title?: string;
    icon?: string;
    boards: { title: string; id: string }[];
  }>();

  const tbColumns = [
    'Game',
    'Time',
    'User',
    'Bet amount',
    'Multiplier',
    'Payout',
  ];

  let tbRows = [
    {
      game: {
        src: '/img/default-game-tumb.png',
        name: 'Game name'
      },
      time: '10:55:25 AM',
      user: 'Twiy_ni***6',
      amount: {
        amount: '0.00000000',
        currencyCode: 'BTC'
      },
      multiplier: '1.40x',
      payout: {
        amount: '0.00000000',
        currencyCode: 'BTC'
      },
    },
    {
      game: {
        src: '/img/default-game-tumb.png',
        name: 'Game name'
      },
      time: '10:55:25 AM',
      user: 'Twiy_ni***6',
      amount: {
        amount: '0.00000000',
        currencyCode: 'USDT'
      },
      multiplier: '1.40x',
      payout: {
        amount: '0.00000000',
        currencyCode: 'USDT',
        isAccented: true,
      },
    },
    {
      game: {
        src: '/img/default-game-tumb.png',
        name: 'Game name'
      },
      time: '10:55:25 AM',
      user: 'Twiy_ni***6',
      amount: {
        amount: '0.00000000',
        currencyCode: 'USD'
      },
      multiplier: '1.40x',
      payout: {
        amount: '0.00000000',
        currencyCode: 'USD',
        isAccented: true
      },
    },
    {
      game: {
        src: '/img/default-game-tumb.png',
        name: 'Game name'
      },
      time: '10:55:25 AM',
      user: 'Twiy_ni***6',
      amount: {
        amount: '0.00000000',
        currencyCode: 'USD',
        isAccented: true,
      },
      multiplier: '1.40x',
      payout: {
        amount: '0.00000000',
        currencyCode: 'USD'
      },
    },
  ];

  const isOpen = ref<boolean>(false);
  const selectedNavItem = ref<string>(props.boards[0]?.id);
  const isAnimate = ref<boolean>(false);

  const selectedNavTitle = computed(() => {
    return navItems.find((item) => item.id === selectedNavItem.value)?.title;
  });

  const toggleMobileNav = () => {
    isOpen.value = !isOpen.value;
  };

  const selectNavItem = (id: string) => {
    selectedNavItem.value = id;
  };

  const hideNav = () => {
    isOpen.value = false;
  };

  const onAnimationEnd = () => {
    isAnimate.value = false;
  };

  const tick = () => {
    const lastRow = tbRows.pop();
    tbRows = [lastRow, ...tbRows];

    nextTick(() => {
      isAnimate.value = true;
    });
  };

  onMounted(() => {
    //setInterval(tick, 1000);
  });
</script>

<style src="~/assets/styles/components/activity-board.scss" lang="scss"/>