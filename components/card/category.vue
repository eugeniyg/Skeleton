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

<style lang="scss">
.categories {
  display: flex;
  grid-gap: var(--gap, #{rem(16px)});
  padding: var(--padding, #{rem(40px)} #{rem(16px)});
  background-color: var(--gray-900);
  margin-top: rem(40px);
  margin-left: var(--margin-left, #{rem(-16px)});
  margin-right: var(--margin-right, #{rem(-16px)});

  @include media(sm) {
    --margin-left: #{rem(-32px)};
    --margin-right: #{rem(-32px)};
  }

  @include media(l) {
    --padding: #{rem(40px)} #{rem(40px)};
    --gap: #{32px};
    --margin-left: #{rem(-40px)};
    --margin-right: #{rem(-40px)};
  }
}

.card-category {
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  position: relative;

  .cover {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    width: 100%;
    margin-bottom: var(--margin-bottom, #{rem(8px)});
    position: relative;
    overflow: hidden;

    @include media(sm) {
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: linear-gradient(180deg, rgba(14, 9, 30, 0) 0%, #0E091E 100%);
        border-radius: 8px;
      }
    }

    .img {
      width: 100%;
      display: block;
      object-fit: cover;
      margin: 0 auto;

      @include media(xxl) {
        max-height: rem(320px);
        transform: scale(1.2);
      }
    }
  }

  .items {
    display: grid;
    grid-template-rows: auto auto 1fr;

    @include media(sm) {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: rem(24px) rem(24px) rem(32px) rem(24px);
    }
  }

  .title {
    @include font($heading-4);
    color: var(--white);
    display: flex;
    align-items: center;
    grid-gap: rem(8px);
    margin-bottom: var(--margin-bottom, #{rem(4px)});

    @include media(l) {
      @include upd-font($heading-5);
      --margin-bottom: #{rem(8px)}
    }
  }

  .icon {
    --icon-size: #{rem(22px)};
    --color: var(--white);
  }

  .sub-title {
    @include font($body-1);
    color: var(--gray-300);
    margin-bottom: rem(8px);

    @include media(l) {
      @include upd-font($body-3);
    }
  }

  .btn-primary {
    --width: 100%;
    --padding: #{rem(7px)} #{rem(24px)};
    @include upd-font($heading-2);
    margin-top: auto;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: center;

    @include media(xs) {
      --padding: #{rem(11px)} #{rem(24px)};
      --width: fit-content;
    }
  }
}
</style>
