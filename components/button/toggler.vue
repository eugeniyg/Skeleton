<template>
  <div class="toggler-btn">
    <button-base
      v-for="(button, index) in props.items"
      :key="index"
      :isActive="$route.path === localizePath(button.url) || ($route.query.category && index === 0)"
      @click="selectTab(button.url)"
    >
      <atomic-icon :id="button.icon" />
      <span class="text">{{ button.label }}</span>
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
  const { localizePath } = useProjectMethods();

  const selectTab = (url: string):void => {
    if (url === '/betting' && !isLoggedIn.value) showModal('register');
    else router.push(localizePath(url));
  };
</script>

<style src="~/assets/styles/components/button/toggler.scss" lang="scss" />

