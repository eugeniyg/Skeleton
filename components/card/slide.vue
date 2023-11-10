<template>
  <div class="card-slide">
    <picture class="card-slide__picture card-slide__picture--back">
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.images.mobile.backgroundImage)" />
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.desktop.backgroundImage)" />
      <atomic-image class="card-slide__img card-slide__img--back" :src="props.images.mobile.backgroundImage" />
    </picture>

    <picture class="card-slide__picture card-slide__picture--front">
      <source :media="'(max-width: 1279px)'" :srcset="createSrcSet(props.images.mobile.faceImage)" />
      <source :media="'(max-width: 2264px)'" :srcset="createSrcSet(props.images.desktop.faceImage)" />
      <atomic-image class="card-slide__img card-slide__img--front" :src="props.images.mobile.faceImage" />
    </picture>

    <div class="card-slide__info">
      <div class="card-slide__title" v-if="props.title" v-html="marked.parse(props.title)" />
      <div class="card-slide__content" v-if="props.content" v-html="marked.parse(props.content)" />
      
      <div class="card-slide__actions" v-if="props.button">
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
    content: {
      type: String,
      required: false,
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

<style src="~/assets/styles/components/card/slide.scss" lang="scss" />

