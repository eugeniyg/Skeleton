<template>
  <div class="row-sex">
    {{ valueName }}<atomic-icon v-if="iconName" :id="iconName"/>
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

  const { fieldsContent } = useGlobalStore();
  const valueName = computed(() => {
    switch (props.value) {
    case 'male':
      return fieldsContent?.gender.maleLabel;
    case 'female':
      return fieldsContent?.gender.femaleLabel;
    default:
      return '';
    }
  });

  const iconName = computed(() => {
    switch (props.value) {
    case 'male':
      return 'male';
    case 'female':
      return 'female';
    default:
      return '';
    }
  });
</script>

<style lang="scss">
.row-sex {
  display: flex;
  align-items: center;
  grid-column-gap: rem(8px);
  text-transform: capitalize;

  svg {
    color: white;
  }
}
</style>
