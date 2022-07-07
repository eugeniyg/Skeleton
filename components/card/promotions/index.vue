<template>
  <div class="card-promotions">
    <div class="img" :style="backgroundImage"/>

    <div class="content">
      <div class="title">{{ props.title }}</div>
      <div class="sub-title">{{ props.subTitle }}</div>
      <div class="actions">
        <button-base type="primary" size="md" @click="isLoggedIn ? openDepositModal() : showModal('register') ">{{ props.bonusBtnTitle }}</button-base>
        <nuxt-link class="link-more" :to="localizePath(props.href)">{{ props.linkMoreText }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script  setup lang="ts">
  import { storeToRefs } from 'pinia';

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
    href: {
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

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();

  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss" src="./style.scss"/>
