<template>
  <div class="card-home">
    <div class="content">
      <div
        v-if="props.images?.backgroundImage"
        class="back-bg"
      >
        <atomic-picture :src="props.images.backgroundImage" notLazy/>
      </div>

      <div
        v-if="props.images?.faceImage"
        class="front-bg"
      >
        <atomic-picture :src="props.images.faceImage" notLazy />
      </div>
    </div>
    
    <div class="loyalty-home" v-if="isLoggedIn">
      <div class="loyalty-home__title" v-if="loggedTitle" v-html="loggedTitle"/>
      <div class="loyalty-home__sub-title" v-if="props.loggedSubTitle" v-html="marked.parse(props.loggedSubTitle)"/>
      <loyalty-progress-display />
    </div>
    
    <div class="info" v-else>
      <div class="title" v-if="props.title" v-html="marked.parse(props.title)"/>
      <div class="card-home__content" v-if="props.content" v-html="marked.parse(props.content)"/>

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
    loggedTitle: {
      type: String,
      default: '',
    },
    loggedSubTitle: {
      type: String,
      default: '',
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openWalletModal } = useLayoutStore();
  const { handleExternalLink } = useProjectMethods();
  const { profile } = storeToRefs(profileStore);
  
  const loggedTitle = computed(() => {
    if (props.loggedTitle) {
      return marked.parse(props.loggedTitle.replace('{nickname}', profile.value?.nickname));
    }
    return '';
  });

  const clickButton = (url: string): void => {
    if (url) handleExternalLink(url)
    else isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
  };
</script>

<style src="~/assets/styles/components/card/home.scss" lang="scss" />
