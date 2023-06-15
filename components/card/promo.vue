<template>
  <div class="promo-card">
    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="props.images.mobile.backgroundImage" />
      <source :media="'(max-width: 2264px)'" :srcset="props.images.desktop.backgroundImage" />
      <img class="back" :src="props.images.mobile.backgroundImage" alt=""/>
    </picture>

    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="props.images.mobile.faceImage" />
      <source :media="'(max-width: 2264px)'" :srcset="props.images.desktop.faceImage" />
      <img class="front" :src="props.images.mobile.faceImage" alt=""/>
    </picture>

    <div class="info">
      <div class="title" v-if="props.title" v-html="marked.parse(props.title)" />
      <div class="content" v-if="props.content" v-html="marked.parse(props.content)" />

      <div class="actions" v-if="props.button">
        <button-base
          type="primary"
          size="md"
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
  const { showModal, openDepositModal } = useLayoutStore();

  const clickButton = (url:string):void => {
    if (url) {
      const router = useRouter();
      const { localizePath } = useProjectMethods();
      router.push(localizePath(url));
    } else isLoggedIn.value ? openDepositModal() : showModal('register');
  };
</script>

<style src="~/assets/styles/components/card/promo.scss" lang="scss" />

