<template>
  <div class="btn-copy__wrap">
    <input
      class="btn-copy__input"
      ref="input"
      type="text"
      :value="props.text"
      readonly
    >

    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="btn-copy__tooltip">{{ props.copyTooltip}}</div>
    </transition>

    <button class="btn-copy" @click="actionClick">
      {{ props.copyButton }}
      <atomic-icon id="copy"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const input = ref<HTMLInputElement>();
  const props = defineProps<{
    text: string,
    copyButton: string,
    copyTooltip: string,
  }>();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const showTooltip = ():void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const actionClick = () => {
    if (input.value) {
      input.value.focus();
      input.value.select();
      document.execCommand('copy');
      showTooltip();
    }
  };
</script>

<style src="~/assets/styles/components/button/copy.scss" lang="scss" />

