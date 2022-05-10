<template>
  <div class="main-layout">
    <Head>
      <Title>Slotsbet</Title>
      <Meta name="description" content="Platform Project" />
      <Link
        rel="icon"
        type="image/svg"
        sizes="16x16"
        href="/favicon/logo-short.svg"
      />
    </Head>

    <layout-header
      :is-logged-in="isLoggedIn"
      @login="login"
      @logout="logout"
      @register="register"
    />

    <layout-drawer :is-logged-in="isLoggedIn" :is-compact="isDrawerCompact" @compact="compact"/>

    <main class="app-main" :class="{'is-overflow': globalMethods.isHomePage}">
      <NuxtPage class="app-page" :class="`page--${$route.name}`"/>
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <nav-mob />
  </div>
</template>

<script setup lang="ts">
  const { isDrawerCompact, compactDrawer } = useLayoutStore();
  const { isLoggedIn, logIn, logOut } = useUserStore();
  const globalMethods = useGlobalMethods();

  function login():void {
    logIn();
  }

  function logout():void {
    logOut();
  }

  function register():void {
    console.log('register');
  }

  function compact():void {
    compactDrawer();
  }
</script>

<style lang="scss">
@import "@/scss/style.scss";
</style>
