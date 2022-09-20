<template>
  <div class="card-category">
    <div class="cover">
      <img class="img" :src="props.image" alt="">
    </div>

    <div class="items">
      <div class="title">
        <atomic-icon :id="props.icon"/>
        {{ props.title }}
      </div>

      <div class="sub-title">{{ props.description }}</div>

      <button-base
        type="primary"
        size="md"
        @click="changePage(props.button.url)"
      >
        {{ props.button.label }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    image: string,
    icon: string,
    title: string,
    description: string,
    button: {
      label: string,
      url: string
    }
  }>();

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();
  const { localizePath } = useProjectMethods();

  const changePage = (link: string): void => {
    if (link === '/betting' && !isLoggedIn.value) showModal('register');
    else router.push(localizePath(link));
  };
</script>

<style lang="scss" src="./style.scss"/>
