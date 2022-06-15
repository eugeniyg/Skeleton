<template>
  <header class="app-header">
    <atomic-logo/>
    <button-search/>

    <div class="items">
      <template v-if="props.isLoggedIn">
        <atomic-notification :is-active="true"/>
        <popover-notifications :items="fakeStore.items.notifications" :max="5"/>
        <form-input-deposit/>
        <atomic-avatar @toggle="toggleProfileNav" :is-button="true"/>
        <nav-user :avatar-items="avatarItems" @logout="logout"/>
      </template>

      <template v-else>
        <button-base
          type="secondary"
          size="md"
          @click="emit('register')"
        >
          Registration
        </button-base>

        <button-base
          type="primary"
          size="md"
          @click="emit('login')"
        >
          Login
        </button-base>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['login', 'register', 'logout']);
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isUserNavOpen } = storeToRefs(layoutStore);
  const { closeUserNav, openUserNav } = layoutStore;
  const { avatarItems } = storeToRefs(profileStore);
  const fakeStore = useFakeStore();

  function toggleProfileNav():void {
    if (isUserNavOpen.value) closeUserNav();
    else openUserNav();
  }

  function close():void {
    closeUserNav();
  }

  function logout():void {
    close();
    emit('logout');
  }
</script>

<style lang="scss" src="./style.scss"/>
