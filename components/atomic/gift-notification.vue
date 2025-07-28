<template>
  <button
    class="gift-notification"
    :class="{ 'is-active': props.isActive }"
    :data-display="props.display"
    @click="toBonuses"
  >
    <atomic-icon id="bonuses" />
  </button>
</template>

<script setup lang="ts">
  const router = useRouter();
  const toBonuses = async (): Promise<void> => {
    await router.push(localizePath('/profile/bonuses'));
  };

  const props = defineProps<{
    display: 'desktop' | 'mobile';
    isActive?: boolean;
  }>();
</script>

<style src="~/assets/styles/components/atomic/gift-notification.scss" lang="scss" />
