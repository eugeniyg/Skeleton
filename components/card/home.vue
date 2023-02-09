<template>
  <div class="card-home">
    <div class="content">
      <div class="back-bg" :style="{backgroundImage: `url(${props.images.backgroundImage})`}"></div>
      <div class="front-bg" :style="{backgroundImage: `url(${props.images.faceImage})`}"></div>
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
          <atomic-icon v-if="props.button.icon" :id="props.button.icon" />
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

  const clickButton = (url: string): void => {
    if (url) {
      const router = useRouter();
      const { localizePath } = useProjectMethods();
      router.push(localizePath(url));
    } else isLoggedIn.value ? openDepositModal() : showModal('register');
  };
</script>

<style lang="scss">
@use "sass:math";

.card-home {
  display: grid;
  width: 100%;
  position: relative;
  max-height: 309px;

  &:before {
    width: 50%;
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 2;
    background: linear-gradient(270deg, #11141C 0%, rgba(14, 9, 30, 0) 96.21%, rgba(17, 20, 28, 0) 96.21%);
  }

  &:after {
    content: '';
    padding-top: 52%;
  }

  @include media(sm) {
    max-height: 309px;
  }

  @include media(xxxl) {
    max-height: 390px;
  }

  .back-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: top center;
    mix-blend-mode: multiply;
    opacity: 0.6;
    max-height: 912px;

    @include media(l) {
      max-height: 508px;
    }

    @include media(xl) {
      max-height: 620px;
    }

    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      background: linear-gradient(360deg, #11141C 0%, rgba(17, 20, 28, 0.0468566) 95.31%, rgba(14, 9, 30, 0) 100%);
      left: 0;
      right: 0;
      height: 50%;
      z-index: 4;
    }
  }

  .front-bg {
    position: absolute;
    top: 30px;
    right: 12px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: top right;
    z-index: 3;
    width: 52%;
    height: 100%;
    background-image: linear-gradient(270deg, #0E091E 0%, rgba(14, 9, 30, 0) 96.21%);

    @include media(xs) {
      right: rem(32px);
    }

    @include media(sm) {
      right: rem(39px);
    }

    @include media(md) {
      right: rem(65px);
    }

    @include media(l) {
      right: 155px;
      height: 110%;
    }

    @include media(xl) {
      height: 162%;
    }

    @include media(xxl) {
      padding-top: 24%;
      right: 308px
    }
  }

  .title {
    color: var(--white);
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);

    max-width: var(--title-max-width, #{rem(190px)});

    @include media(xs) {
      --title-max-width: #{rem(300px)};
    }

    @include media(sm) {
      --title-max-width: #{rem(400px)};
    }

    @include media(xxxl) {
      --title-max-width: #{rem(650px)};
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      padding: 0;
      @include font($heading-4);

      @include media(xs) {
        @include upd-font($heading-6);
      }

      @include media(sm) {
        @include upd-font($heading-7);
      }

      @include media(xxxl) {
        @include upd-font($heading-9);
      }
    }
  }

  .content {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .info {
    position: absolute;
    @extend %flex-column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    top: 0;
    bottom: 0;
    grid-row-gap: var(--row-gap, #{rem(16px)});
    width: var(--info-width, 70%);
    padding: var(--padding, #{0 0 0 rem(24px)});
    z-index: 4;

    .home & {
      --info-width: 60%;
    }

    @include media(xs) {
      --padding: #{0 0 0 rem(32px)};
    }

    @include media(sm) {
      --padding: #{0 0 0 rem(40px)}
    }

    @include media(md) {
      --padding: #{0 0 0 rem(56px)};
    }

  }

  ul {
    color: var(--white);
    display: var(--display, none);
    flex-direction: column;
    list-style-type: disc;
    padding: 0 0 0 rem(16px);
    grid-gap: rem(2px);

    li {
      @include font($heading-3);
      text-decoration: none;
    }

    @include media(sm) {
      --display: flex;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
  }

  .btn-primary, .btn-secondary {
    white-space: nowrap;
    @include upd-font($heading-2);
    --padding: #{rem(12px) rem(24px)};

    @include media(md) {
      @include upd-font($heading-3);
      --padding: #{rem(12px) rem(32px)};
    }
  }

}

.promo-card-wrapper {
  margin-top: rem(-24px);
  margin-left: var(--margin-left, #{rem(-16px)});
  margin-right: var(--margin-right, #{rem(-16px)});
  position: relative;
  z-index: 0;

  @include media(sm) {
    --margin-left: #{rem(-32px)};
    --margin-right: #{rem(-32px)};
  }

  @include media(l) {
    --padding: #{rem(40px)} #{rem(40px)};
    --margin-left: #{rem(-48px)};
    --margin-right: #{rem(-48px)};
  }
}
</style>
