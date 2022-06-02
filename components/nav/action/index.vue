<template>
  <div class="nav-action">
    <button
      v-for="{icon, id} in props.items"
      :key="id"
      class="item"
      @click="clickButton(id)"
      :class="{'is-active': isActive(id)}"
    >
      <atomic-icon :id="icon"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const router = useRouter();
  const pressed = ref<any>([]);

  const isActive = (id:any):boolean => pressed.value.includes(id);

  const closeGame = ():void => {
    if (window.history.state.back) {
      router.back();
    } else {
      router.push({ name: 'index' });
    }
  };

  const clickButton = (id:string):void => {
    if (id === 'close') closeGame();
    // const index = pressed.value.includes(id);
    // if (!index) {
    //   pressed.value.push(id);
    // } else {
    //   pressed.value = [...pressed.value.filter((item) => item !== id)];
    // }
  };
</script>

<style lang="scss" src="./style.scss"/>
