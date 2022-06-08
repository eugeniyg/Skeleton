<template>
  <teleport to="body">
    <div class="nav-currency" @mouseleave="close">
      <div class="header">
        <button-base
          v-for="{id, title} in navItems"
          :key="id"
          :id="id"
          tag-name="button"
          type="ghost"
          size="sm"
          :is-active="selected === id"
          @click="select(id)"
        >
          {{ title }}
        </button-base>
      </div>

      <div class="content">
        <div class="items">
          <div
            v-for="{ src, title, id } in selectedItems"
            :key="id"
            class="item"
            :id="id"
          >
            <img class="img" :src="`/img${src}`" />
            <span class="title">{{ title }}</span>
            <span class="label">{{ id }}</span>
          </div>
        </div>
      </div>
      <button-base type="primary" size="md">Add currency</button-base>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  const navItems = [
    {
      id: 'all-currency',
      title: 'All currency',
    },
    {
      id: 'crypto',
      title: 'Crypto',
    },
  ];
  const items = {
    'all-currency': [
      {
        id: 'NZD',
        src: '/currency/1.png',
        title: 'New Zealand dollar',
      },
      {
        id: 'NZD',
        src: '/currency/2.png',
        title: 'Brazilian Real',
      },
      {
        id: 'BTC',
        src: '/currency/1.png',
        title: 'Bitcoin cash',
      },
      {
        id: 'XRP',
        src: '/currency/2.png',
        title: 'Ripple',
      },
      {
        id: 'NZD',
        src: '/currency/1.png',
        title: 'Canadian Dollar',
      },
      {
        id: 'ETH',
        src: '/currency/2.png',
        title: 'Ethereum ',
      },
      {
        id: 'BTC',
        src: '/currency/1.png',
        title: 'Bitcoin cash',
      },
      {
        id: 'XRP',
        src: '/currency/2.png',
        title: 'Ripple',
      },
      {
        id: 'NZD',
        src: '/currency/1.png',
        title: 'Canadian Dollar',
      },
      {
        id: 'ETH',
        src: '/currency/2.png',
        title: 'Ethereum ',
      },
    ],
    crypto: [
      {
        id: 'BTC',
        src: '/currency/1.png',
        title: 'Bitcoin cash',
      },
      {
        id: 'XRP',
        src: '/currency/2.png',
        title: 'Ripple',
      },
      {
        id: 'NZD',
        src: '/currency/1.png',
        title: 'Canadian Dollar',
      },
      {
        id: 'XRP',
        src: '/currency/2.png',
        title: 'Ripple',
      },
      {
        id: 'NZD',
        src: '/currency/1.png',
        title: 'Canadian Dollar',
      },
      {
        id: 'ETH',
        src: '/currency/2.png',
        title: 'Ethereum ',
      },
    ],
  };
  const selected = ref<string>('all-currency');

  const selectedItems = computed(() => items[selected.value]);

  const select = (id:string):void => {
    selected.value = id;
  };

  const { closeCurrencyNav } = useLayoutStore();
  const close = ():void => {
    closeCurrencyNav();
  };
</script>

<style lang="scss" src="./style.scss"/>
