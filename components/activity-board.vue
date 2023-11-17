<template>
  <div class="activity-board">
    <div class="activity-board__header">
      <atomic-icon class="activity-board__header-icon" id="clewer"/>
      <div class="activity-board__header-title">Bets</div>
      
      <div
        class="activity-board__nav"
        :class="{'is-open': isOpen}"
        v-click-outside="hideNav"
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
            class="activity-board__nav-item"
            :class="{'is-active': id === selectedNavItem}"
            v-for="{id, title} in navItems"
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
          class="activity-board__tb-th"
          :class="`th-${index + 1}`"
          v-for="(title, index) in tbColumns"
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
          class="activity-board__tb-row"
          v-for="row in tbRows"
        >
          <div
            class="activity-board__tb-td"
            :class="`td-${index + 1}`"
            v-for="(td, key, index) in row"
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
  const navItems = [
    {
      title: 'All bets',
      id: 'all_bets',
    },
    {
      title: 'Last wins',
      id: 'last_wins',
    },
    {
      title: 'Big wins',
      id: 'big_wins',
    }
  ];
  
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
  const selectedNavItem = ref<string>(navItems[0].id);
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
    setInterval(tick, 1000);
  });
</script>

<style src="~/assets/styles/components/activity-board.scss" lang="scss"/>