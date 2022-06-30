<template>
  <div class="faq">
    <div class="header">
      <div class="title">Frequently asked questions</div>
      <!--<div class="sub-title">Didn’t find an answer? Conact to or <a hef="#">Contact Support</a></div>-->
    </div>
    <nav-faq :items="menu.faq"/>
    <NuxtPage :key="`faq-child${$route.fullPath}`" />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: (to) => {
      if (to.name === 'questions') {
        return navigateTo({ name: 'questions-most-popular' });
      }
      return true;
    },
  });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./questions/style.scss"/>
