<template>
  <div class="row-sex">
    {{ props.value }}<atomic-icon :id="iconName"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    value: {
      type: String,
      validator: (val:string) => ['Male', 'Female'].includes(val),
      required: false,
    },
  });

  const iconName = computed(() => {
    switch (props.value) {
    case 'Male':
      return 'ui-male';
    case 'Female':
      return 'ui-female';
    default:
      return 'ui-male';
    }
  });
</script>

<style lang="scss" src="./style.scss" />
