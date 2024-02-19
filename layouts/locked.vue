<template>
  <div class="locked">
    <atomic-image class="locked__logo" src="/img/logo-light.svg" />
    <atomic-image class="locked__media" src="/img/locked.png" />

    <h2 class="locked__title">Country blocked</h2>
    <h4 class="locked__sub-title">Sorry, but players from your country are not allowed to visit Slotsbet.io.</h4>

    <div class="locked__support">
      <h3 class="locked__support-title">Get in touch</h3>
      <h4 class="locked__support-sub-title">If you have questions please contact</h4>
      <a href="mailto:support@slotsbet.io" class="locked__support-mail-to">support@slotsbet.io</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { setPageSeo } = useProjectMethods();
  setPageSeo({});
</script>

<style src="~/assets/styles/layouts/locked.scss" lang="scss" />

