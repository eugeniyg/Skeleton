<template>
  <div
    class="input-payments"
    :class="classes"
  >
    <div v-if="props.items.length" class="selected" @click="open">
      <img v-if="props.activeMethod.logo" class="mask" :src="props.activeMethod.logo" />
      <atomic-icon id="ui-arrow_expand-close"/>
    </div>

    <div class="items" v-if="props.items.length">
      <div
        class="item"
        v-for="(item, i) in props.items"
        :key="i"
        :class="{'is-selected': item.method === props.activeMethod.method }"
        @click="select(item)"
      >
        <img v-if="item.logo" class="mask" :src="item.logo" />
      </div>
    </div>
    <input type="hidden" name="payments" :value="props.activeMethod.method" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    activeMethod: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:activeMethod']);
  const isOpen = ref<boolean>(false);

  const classes = computed(() => [
    { 'is-open': isOpen.value },
  ]);

  const select = (method:any):void => {
    emit('update:activeMethod', method);
    isOpen.value = false;
  };

  const open = ():void => {
    isOpen.value = !isOpen.value;
  };
</script>

<style lang="scss" src="./style.scss"/>
