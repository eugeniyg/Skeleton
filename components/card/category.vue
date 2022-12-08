<template>
  <div class="card-cat" :class="`card-cat-${props.mod}`">
    <div class="title">
      {{ props.title }}
    </div>

    <div class="sub-title">{{ props.description }}</div>

    <img class="icon" :src="props.image" alt="">

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

<style lang="scss">
.cards-wrap {
  display: flex;
  position: relative;
  flex-direction: column;
  grid-gap: rem(16px);
  background: linear-gradient(360deg, #11141C 0%, rgba(17, 20, 28, 0) 100%);

  @include media(xxl) {
    flex-direction: row;
  }
}

.cards-cat {
  position: relative;
  display: flex;
  grid-gap: rem(16px);
  flex-direction: column;
  flex-grow: 1;

  @include media(sm) {
    flex-direction: row;
  }
}

.card-cat {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--card-padding, #{rem(16px)} #{rem(24px)});
  isolation: isolate;
  min-height: var(--card-min-height, #{rem(167px)});
  background: var(--orange-700);
  border-radius: 8px;
  align-content: flex-start;
  flex-grow: 1;
  width: 100%;

  @include media(md) {
    --card-padding: #{rem(24px)} #{rem(24px)};
  }

  .title {
    @include font($heading-5);
    color: var(--white);
    position: relative;
    z-index: 1;
    margin-bottom: rem(4px);
    width: 57%;

    @include media(md) {
      @include upd-font($heading-6)
    }

    @include media(xxxl) {
      @include upd-font($heading-7)
    }
  }

  .sub-title {
    @include font($body-2);
    color: var(--white);
    position: relative;
    z-index: 1;
    margin-bottom: rem(24px);
    width: 54%;
  }

  .btn-secondary {
    z-index: 1;
    margin-top: auto;
  }

  @include media(l) {
    --card-min-height: #{rem(188px)};
  }

  .icon {
    grid-area: icon;
    width: rem(160px);
    height: rem(136px);
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto 0;

    @include media(md) {
      transform: translateX(#{rem(16px)});
      width: rem(260px);
      height: rem(220px);
      top: auto;
    }
  }
}

.card-cat-casino {
  background-color: #d16004;
  background-image: linear-gradient(
      -94.47deg,
      rgba(96, 12, 135, 0) 1.41%,
      rgba(95, 12, 135, 0.44) 97.61%
  ),
  linear-gradient(
      240.53deg,
      rgba(17, 20, 28, 0) 56.15%,
      rgba(17, 20, 28, 0.24) 87.99%
  );

  box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);
}

.card-cat-betting {
  background-color: #640B8E;
  background-image: linear-gradient(94.47deg, rgba(230, 164, 9, 0) 1.41%, rgba(230, 164, 9, 0.44) 97.61%),
  linear-gradient(240.53deg, rgba(17, 20, 28, 0) 56.15%, rgba(17, 20, 28, 0.24) 87.99%);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);
}
</style>
