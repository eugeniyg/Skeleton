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

  const toggleFullScreen = ():void => {
    const elem:any = document.querySelector('.box-game .container');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const toggleFavorite = ():void => {
    if (pressed.value.includes('favorites')) {
      pressed.value = [...pressed.value.filter((item) => item !== 'favorites')];
    } else pressed.value.push('favorites');
  };

  const clickButton = (id:string):void => {
    if (id === 'close') closeGame();
    else if (id === 'full-screen') toggleFullScreen();
    else if (id === 'favorites') toggleFavorite();
  };
</script>

<style lang="scss" src="./style.scss"/>
