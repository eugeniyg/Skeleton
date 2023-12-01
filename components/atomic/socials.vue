<template>
  <div class="socials">
    <div class="socials__title">Or sign up with</div>
    
    <div class="socials__items">
      <span
        class="socials__item"
        :class="`--${item.icon}`"
        v-for="item in items"
      >
        <atomic-icon :id="item.icon"/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const items = [
    {
      'icon': 'twitter',
    },
    {
      'icon': 'facebook',
    },
    {
      'icon': 'google',
    },
    {
      'icon': 'twitch',
    },
    {
      'icon': 'telegram',
    }
  ];
</script>

<style src="@skeleton/assets/styles/components/atomic/socials.scss" lang="scss"/>
