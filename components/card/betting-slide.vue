<template>
  <div class="card-betting-slide">
    <picture class="card-betting-slide__picture card-betting-slide__picture--back">
      <source :srcset="createSrcSet(props.images.backgroundImage)" />
      <atomic-image class="card-betting-slide__img card-betting-slide__img--back" :src="props.images.backgroundImage" />
    </picture>

    <picture class="card-betting-slide__picture card-betting-slide__picture--front">
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.faceImage)" />
      <atomic-image class="card-betting-slide__img card-betting-slide__img--front" :src="props.images.faceImage" />
    </picture>

    <div class="card-betting-slide__info">
      <div class="card-betting-slide__title" v-if="props.title" v-html="marked.parse(props.title)" />
      <div class="card-betting-slide__actions" v-if="props.button">
        <button-base
          type="primary"
          @click="clickButton(props.button.url)"
        >
          {{ props.button.label }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';

  const props = defineProps({
    images: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    button: {
      type: Object,
      required: false,
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openWalletModal } = useLayoutStore();
  const { createSrcSet } = useProjectMethods()

  const clickButton = (url:string):void => {
    if (url) {
      const router = useRouter();
      const { localizePath } = useProjectMethods();
      router.push(localizePath(url));
    } else isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
  };
</script>

<style src="~/assets/styles/components/card/betting-slide.scss" lang="scss" />

