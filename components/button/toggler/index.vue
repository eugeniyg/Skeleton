<template>
  <div class="toggler-btn">
    <button-base
      v-for="(button, index) in props.items"
      :key="index"
      :isActive="$route.path === button.url"
      @click="selectTab(button.url)"
    >
      <atomic-icon :id="button.icon"/>
      <span class="text">{{ button.title }}</span>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();
  const router = useRouter();

  const selectTab = (url: string):void => {
    if (url === '/betting' && !isLoggedIn.value) showModal('register');
    else router.push(url);
  };
</script>

<style lang="scss" src="./style.scss"/>
