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
  const { menu } = useFakeStore();
  const { needToChangeLanguage } = useProjectMethods();

  if (!needToChangeLanguage()) {
    const { localizePath } = useProjectMethods();
    const route = useRoute();

    if (route.path === localizePath('/questions')) {
      navigateTo(localizePath('/questions/most-popular'), { replace: true });
    }
  }
</script>

<style lang="scss" src="./questions/style.scss"/>
