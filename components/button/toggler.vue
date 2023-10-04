<template>
  <div class="toggler-btn">
    <button-base
      v-for="(button, index) in Object.values(props.items)"
      :key="index"
      :isActive="$route.path === localizePath(button.url) || ($route.query.category && index === 0)"
      :url="button.url"
    >
      <atomic-icon :id="button.icon" />
      <span class="text">{{ button.label }}</span>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  interface IToggleButton {
    label: string;
    url: string;
    icon: string;
  }
  const props = defineProps<{
    items: {
      buttonFirst: IToggleButton;
      buttonSecond: IToggleButton;
    };
  }>();

  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/button/toggler.scss" lang="scss" />

