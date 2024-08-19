<template>
  <div
    class="notifications-popover-activator"
    :class="{ 'is-active': props.isActive }"
    ref="item"
    @click.stop.prevent="toggle"
  >
    <atomic-icon id="notification"/>
    <span
      class="notifications-popover-activator__count"
      v-if="props.count"
    >
      {{ count }}
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive: boolean;
    count: number
  }>();
  
  const item = ref();
  
  const emit = defineEmits(['style', 'activate', 'hide']);
  
  const count = computed(() => props.count > 100 ? `${props.count}+` : props.count);
  
  const toggle = () => {
    if (!props.isActive) {
      const rect = item.value?.getBoundingClientRect();
      emit('style', rect.left + (rect.width / 2));
      emit('activate');
    } else {
      hide();
    }
  };
  
  const hide = (): void => {
    emit('hide');
  };
  
  onMounted(() => {
    window.addEventListener('resize', hide);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', hide);
  });
</script>

<style src="~/assets/styles/components/notifications/popover-activator.scss" lang="scss"/>
