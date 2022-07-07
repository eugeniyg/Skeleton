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
      const { localizePath } = useProjectMethods();

      if (to.path === localizePath('/questions')) {
        return navigateTo({ path: localizePath('/questions/most-popular') });
      }
      return true;
    },
  });
  const { menu } = useFakeStore();
</script>

<style lang="scss" src="./questions/style.scss"/>
