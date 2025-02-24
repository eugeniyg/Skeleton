<template>
  <div class="wallet-pills" :class="{ 'show-prev-overlay': prevButtonShow, 'show-next-overlay': nextButtonShow }">
    <div ref="scrollContainer" class="wallet-pills__container" @scroll="scrollHandler">
      <div class="wallet-pills__control wallet-pills__control-prev">
        <button-base type="ghost-gray" size="xs" @click="clickAction('prev')">
          <atomic-icon id="arrow_previous" />
        </button-base>
      </div>

      <div
        v-for="item in props.items"
        :key="item.amount"
        class="wallet-pills__item"
        :class="{ 'is-selected': String(item.amount) === props.value }"
        @click="selectItem(String(item.amount))"
      >
        {{ item.amount }}
      </div>

      <div class="wallet-pills__control wallet-pills__control-next">
        <button-base type="ghost-gray" size="xs" @click="clickAction('next')">
          <atomic-icon id="arrow_next" />
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPaymentPreset } from '@skeleton/core/types';

  const props = defineProps<{
    value: string;
    items: IPaymentPreset[];
  }>();

  const emit = defineEmits(['update:value']);

  const selectItem = (amount: string): void => {
    if (amount === props.value) return;
    emit('update:value', amount);
  };

  const scrollContainer = ref();
  const prevButtonShow = ref(false);
  const nextButtonShow = ref(false);

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevButtonShow.value = scrollLeft !== 0;
    nextButtonShow.value = Math.abs(scrollWidth - scrollLeft - offsetWidth) > 1;
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth, scrollWidth, scrollLeft } = scrollContainer.value;
    const widthToEnd = scrollWidth - (scrollLeft + offsetWidth);
    const actionScrollWidth = offsetWidth * 0.6;
    const scrollLeftValue = widthToEnd < actionScrollWidth ? widthToEnd : actionScrollWidth;
    const scrollRightValue = scrollLeft < actionScrollWidth ? scrollLeft : actionScrollWidth;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? scrollLeftValue : -scrollRightValue,
      behavior: 'smooth',
    });
  };

  onMounted(async () => {
    await nextTick();
    scrollHandler();
  });
</script>

<style src="~/assets/styles/components/wallet/pills.scss" lang="scss" />
