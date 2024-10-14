<template>
  <button
    class="gift-notification"
    :class="{'is-active': props.isActive}"
    :data-display="props.display"
    @click="toBonuses"
  >
    <atomic-icon id="bonuses"/>
  </button>
</template>

<script setup lang="ts">
  const { localizePath } = useProjectMethods();
  const router = useRouter();
  const toBonuses = async (): Promise<void> => {
    await router.push(localizePath('/profile/bonuses'));
  };

  const props = defineProps({
    display: {
      type: String,
      validator: (val:string) => ['desktop', 'mobile'].includes(val),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style src="~/assets/styles/components/atomic/gift-notification.scss" lang="scss" />
