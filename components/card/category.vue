<template>
  <div class="card-cat" :class="`card-cat-${props.mod}`">
    <div class="title">
      {{ props.title }}
    </div>

    <div class="sub-title">{{ props.description }}</div>

    <nuxt-img class="icon" :src="props.image" alt=""/>

    <button-base
      type="secondary"
      size="md"
      @click="changePage(props.button.url)"
    >
      {{ props.button.label }}
    </button-base>

  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    image: string,
    mod: string,
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

<style src="~/assets/styles/components/card/category.scss" lang="scss" />
