<template>
  <div class="toggler-btn">
    <div class="toggler-btn__wrap">
      <button-base
        v-for="(button, index) in Object.values(props.items)"
        :key="index"
        :is-active="route.path === localizePath(button.url) || (!index && additionalCasinoActive)"
        :url="button.url"
        :target-blank="button?.targetBlank"
      >
        <atomic-icon :id="button.icon" />
        <span class="text">{{ button.label }}</span>
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface IToggleButton {
    label: string;
    url: string;
    icon: string;
    targetBlank?: boolean;
  }
  const props = defineProps<{
    items: {
      buttonFirst: IToggleButton;
      buttonSecond: IToggleButton;
    };
  }>();

  const route = useRoute();
  const additionalCasinoActive = computed(() => {
    const gamesRoute = route.name === 'games-id' || route.name === 'locale-games-id';
    return !!route.params.categoryIdentity || gamesRoute;
  });
</script>

<style src="~/assets/styles/components/button/toggler.scss" lang="scss" />
