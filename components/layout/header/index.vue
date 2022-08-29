<template>
  <header class="app-header">
    <atomic-logo/>

    <button-search @click="showSearch = true" data-show="mobile"/>

    <client-only>
      <div class="items">
        <search
          :isShow="showSearch"
          @hideSearch="showSearch = false"
        />
        <button-search @click="showSearch = true" data-show="desktop"/>

        <template v-if="props.isLoggedIn">
          <atomic-notification :is-active="!!fakeStore.items.notifications.length"/>
          <popover-notifications :items="fakeStore.items.notifications" :max="5"/>
          <form-input-deposit/>
          <atomic-avatar @toggle="toggleProfileNav" :is-button="true"/>
          <nav-user :avatar-items="avatarItems" @logout="logout"/>
        </template>

        <template v-else>
          <button-base
            type="primary"
            size="md"
            @click="showModal('register')"
          >
            {{ headerContent?.registrationButton }}
          </button-base>

          <button-base
            type="secondary"
            size="md"
            @click="showModal('signIn')"
          >
            {{ headerContent?.loginButton }}
          </button-base>
        </template>
      </div>
    </client-only>
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
  const { headerContent } = useGlobalStore();
  const { isUserNavOpen } = storeToRefs(layoutStore);
  const { closeUserNav, openUserNav, showModal } = layoutStore;
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

  const showSearch = ref<boolean>(false);

  const checkSearch = (e:any):void => {
    if (showSearch.value && !e.target.closest('.search') && !e.target.closest('.btn-search')) {
      showSearch.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', checkSearch);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', checkSearch);
  });
</script>

<style lang="scss" src="./style.scss"/>
