<template>
  <div class="card-category">
    <div class="cover"/>

    <div class="title">
      <atomic-icon :id="props.title.icon"/>{{ props.title.text }}
    </div>

    <div class="sub-title">{{ props.subTitle }}</div>

    <button-base
      type="primary"
      size="md"
      @click="changePage"
    >
      {{ props.action.title }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    title: {
      type: Object,
      default: () => ({
        icon: 'cherry',
        text: 'text',
      }),
    },
    subTitle: {
      type: String,
      default: 'sub title',
    },
    action: {
      type: Object,
      default: () => ({
        title: 'Go to',
        href: '#',
      }),
    },
  });

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const changePage = ():void => {
    if (props.action.href === '/betting' && !isLoggedIn.value) showModal('register');
    else router.push(props.action.href);
  };
</script>

<style lang="scss" src="./style.scss"/>
