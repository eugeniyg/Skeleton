<template>
  <div
    class="notifications-popover"
    :style="styleLeft"
    v-click-outside="clickOutside"
    ref="popoverRef"
  >
    <div
      class="notifications-popover__header"
      ref="headerRef"
    >
      <div class="notifications-popover__count">2 new notifications</div>
      
      <form-input-checkbox
        v-model:value="readAll"
        name="notifications-toggle"
        label="Mark all as read"
        icon="read-all"
      />
      
      <atomic-divider/>
    </div>
    
    <div
      class="notifications-popover__items"
      ref="itemsRef"
    >
      <notifications-popover-item
        v-for="(notification, index) in notifications"
        :item="notification"
        :key="index"
        ref="itemRef"
        :read-all="readAll"
      />
    </div>
    
    <atomic-empty
      v-if="!notifications.length"
      title="Nothing found"
      sub-title="Try searching for something else"
      variant="notification"
    />
    
    
    <div
      class="notifications-popover__footer"
      ref="footerRef"
    >
      <button-base type="ghost" v-if="showSeeAllButton">See all</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    offset: number,
    maxCount: number;
  }>();
  
  const emit = defineEmits(['hide']);
  
  const { notifications } = useFakeStore();
  
  const readAll = ref<number | string>('');
  const itemRef = ref();
  const headerRef = ref();
  const footerRef = ref();
  const popoverRef = ref();
  const itemsRef = ref();
  
  const styleLeft = computed(() => `left: ${props.offset}px`);
  
  const showSeeAllButton = computed(() => notifications.length > props.maxCount);
  
  const clickOutside = () => {
    emit('hide');
  };
  
  const itemsHasVerticalScroll = () => {
    const popoverHeight = parseInt(window.getComputedStyle(popoverRef.value).maxHeight);
    const headerHeight = headerRef.value.clientHeight;
    const footerHeight = footerRef.value.clientHeight;
    
    let totalItemsHeight = 0;
    
    itemRef.value.forEach((item: any) => {
      totalItemsHeight += item.getItemHeight();
    });
    
    return ((popoverHeight - headerHeight - footerHeight - 32) <= totalItemsHeight);
  };
  
  const calcItemsHeight = () => {
    const popoverHeight = parseInt(window.getComputedStyle(popoverRef.value).maxHeight);
    const headerHeight = headerRef.value.offsetHeight;
    const footerHeight = footerRef.value.offsetHeight;
    return (popoverHeight - headerHeight - footerHeight - 32) + 'px';
  };
  
  onMounted(() => {
    let totalItemsHeight = 0;
    
    itemRef.value.forEach((item: any) => {
      totalItemsHeight += item.getItemHeight();
    });
    
    nextTick(() => {
      itemsRef.value.style.height = itemsHasVerticalScroll() ? calcItemsHeight() : '';
    });
  });
</script>

<style src="~/assets/styles/components/notifications/popover.scss" lang="scss"/>

