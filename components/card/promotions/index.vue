<template>
  <div class="card-promotions">
    <div class="img" :style="backgroundImage"/>

    <div class="content">
      <div class="title">{{ props.title }}</div>
      <div class="sub-title">{{ props.subTitle }}</div>
      <div class="actions">
        <button-base type="primary" size="md">{{ props.bonusBtnTitle }}</button-base>
        <a class="link-more" href="#">{{ props.linkMoreText }}</a>
      </div>
    </div>
  </div>
</template>

<script  setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    bonusBtnTitle: {
      type: String,
      default: 'Get bonus',
    },
    linkMoreText: {
      type: String,
      default: 'learn more',
    },
  });

  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss" src="./style.scss"/>
