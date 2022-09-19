<template>
  <nav class="nav-user">
    <atomic-avatar-user v-bind="props.avatarItems"/>

    <div class="items">
      <div
        v-for="(item, index) in profileLinks"
        :key="index"
        class="item"
        :class="{ 'is-active': $route.path === localizePath(item.url) }"
        @click="clickItem(item.url)"
      >
        <atomic-icon :id="item.icon" />
        {{ item.label }}
      </div>
    </div>

    <atomic-divider/>
    <button-logout @logout="emit('logout')"/>
  </nav>
</template>

<script setup lang="ts">
  const props = defineProps({
    avatarItems: {
      type: Object,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['logout']);
  const { localizePath } = useProjectMethods();
  const { closeUserNav } = useLayoutStore();
  const { userNavigationContent } = useGlobalStore();
  const profileLinks = userNavigationContent?.profileLinks || [];

  function clickItem(url: string):void {
    const router = useRouter();
    router.push(localizePath(url));
    closeUserNav();
  }
</script>

<style lang="scss" src="./style.scss"/>
