<template>
  <div class="card-home">
    <div class="content">
      <div
        v-if="props.images?.backgroundImage"
        class="back-bg"
      >
        <atomic-image :src="props.images.backgroundImage"/>
      </div>
      <div
        v-if="props.images?.faceImage"
        class="front-bg"
      >
        <atomic-image :src="props.images.faceImage"/>
      </div>
    </div>

    <div class="info">
      <div class="title" v-if="props.title" v-html="marked.parse(props.title)"/>
      <div class="content" v-if="props.content" v-html="marked.parse(props.content)"/>

      <div class="actions" v-if="props.button">
        <button-base
          type="primary"
          size="md"
          @click="clickButton(props.button.url)"
        >
          <atomic-icon :id="props.button.icon" />
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
      type: Object
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

  const clickButton = (url: string): void => {
    if (url) {
      const router = useRouter();
      const { localizePath } = useProjectMethods();
      router.push(localizePath(url));
    } else isLoggedIn.value ? openDepositModal() : showModal('register');
  };
</script>

<style src="~/assets/styles/components/card/home.scss" lang="scss" />
