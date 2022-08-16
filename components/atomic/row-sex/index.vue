<template>
  <div class="row-sex">
    {{ props.value }}<atomic-icon :id="iconName"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    value: {
      type: String,
      validator: (val:string) => ['male', 'female'].includes(val),
      required: false,
    },
  });

  const iconName = computed(() => {
    switch (props.value) {
    case 'male':
      return 'ui-male';
    case 'female':
      return 'ui-female';
    default:
      return 'ui-male';
    }
  });
</script>

<style lang="scss" src="./style.scss" />
