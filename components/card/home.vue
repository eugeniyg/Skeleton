<template>
  <div class="card-home">
    <!--<picture>
      <source :media="'(max-width: 1279px)'" :srcset="props.images.mobile.backgroundImage" />
      <source :media="'(max-width: 2264px)'" :srcset="props.images.desktop.backgroundImage" />
      <img class="back" :src="props.images.mobile.backgroundImage" alt=""/>
    </picture>

    <picture>
      <source :media="'(max-width: 1279px)'" :srcset="props.images.mobile.faceImage" />
      <source :media="'(max-width: 2264px)'" :srcset="props.images.desktop.faceImage" />
      <img class="front" :src="props.images.mobile.faceImage" alt=""/>
    </picture>-->

    <div class="content">

      <div class="back" :style="{backgroundImage: `url(${backBg})`}"></div>
      <div class="front" :style="{backgroundImage: `url(${frontBg})`}"></div>

    </div>

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
  import backBg from '~/assets/img/home-banner/bg.svg';
  import frontBg from '~/assets/img/home-banner/person.png';

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

<style lang="scss">
@use "sass:math";

.card-home {
  display: grid;
  width: 100%;
  position: relative;
  overflow: hidden;
  height: var(--height-card, 204px);

  @include media(l) {
    --height-card: #{rem(309px)};
  }

  @include media(xxxl) {
    --height-card: #{rem(390px)};
  }

  .back {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: top left;
    mix-blend-mode: multiply;
    opacity: 0.6;

    @include media(md) {
      background-size: 75%;
    }
  }

  .front {
    position: absolute;
    top: 30px;
    right: 16px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: var(--width-front-img, #{rem(200px)});
    z-index: 3;

    &:before {
      width: 100%;
      content: '';
      padding-top: 90%;
      display: block;
    }

    @include media(xs) {
      right: rem(32px);
      max-width: 250px;
      --width-front-img:  40%;
    }

    @include media(sm) {
      right: rem(40px);
      --width-front-img:  30%;
    }

    @include media(md) {
      right: rem(75px);
      --width-front-img:  22%;
    }

    @include media(l) {
      right: 65px;
      max-width: 360px;
      --width-front-img: 40%;
    }

    @include media(xl) {
      right: 65px;
      max-width: 410px;
      --width-front-img: 60%;
    }

    @include media(xxl) {
      --width-front-img: 603px;
      right: 135px;
    }

    @include media(xxxl) {
      --width-front-img: 603px;
      right: 400px;
    }
  }

  .title {
    color: var(--white);
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
    max-width: rem(240px);

    @include media(xs) {
      max-width: rem(270px);
    }

    @include media(xxxl) {
      max-width: 670px;
      // border: 1px solid red
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      padding: 0;
      @include font($heading-4);

      @include media(xs) {
        @include upd-font($heading-7);
      }

      //@include media(sm) {
      //  @include upd-font($heading-7);
      //}
      //
      //@include media(md) {
      //  @include upd-font($heading-7);
      //}
      //
      //@include media(xl) {
      //  @include upd-font($heading-7);
      //}

      @include media(xxxl) {
        @include upd-font($heading-9);
      }
    }
  }

  .content {
    position: relative;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      background: linear-gradient(360deg, #0E091E 0%, rgba(14, 9, 30, 0) 100%);
      left: 0;
      right: 0;
      height: 100%;
      z-index: 4;
      transform: translateY(50%);
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      background: linear-gradient(270deg, #0E091E 0%, rgba(14, 9, 30, 0) 96.21%);
      right: 0;
      width: 50%;
      z-index: 1;
    }
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
      --info-width: 50%;
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
      --padding: #{rem(12px) rem(32px)};
    }
  }
}

.promo-card-wrapper {
  margin-bottom: rem(40px);
  margin-top: rem(-24px);
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
</style>
