<template>
  <div>
    <div class="promotion">
      <h1 class="title">{{ welcomeContent?.title }}</h1>
      <h4 class="sub-title">{{ welcomeContent?.description }}</h4>

      <div v-if="welcomeContent?.howGet" class="steps">
        <div class="title">{{ welcomeContent.howGet.label }}</div>

        <div class="items">
          <div
            class="item"
            :key="index"
            v-for="(item, index) in howGetItems"
          >
            <span class="number">{{ index + 1 }}</span>
            <p class="text">{{ item }}</p>
          </div>
        </div>

        <img v-if="welcomeContent?.howGet.image" class="img" :src="welcomeContent?.howGet.image" />
      </div>

      <atomic-divider />

      <div class="welcome">
        <h4 class="title">{{ welcomeContent?.welcome.label }}</h4>

        <div v-if="welcomeContent?.welcome.items?.length" class="items">
          <div
            class="item"
            :key="itemIndex"
            v-for="(card, itemIndex) in welcomeContent.welcome.items"
          >
            <div class="title">{{ card.title }}</div>
            <div class="sub-title">{{ card.topLabel }}</div>
            <img class="img" :src="card.image" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openDepositModal() : showModal('register')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base
                type="ghost"
                size="md"
                :url="card.link.url"
              >
                {{ card.link.label }}
              </button-base>
            </div>

            <div class="arrow">
              <atomic-icon id="arrow_expand-close" />
            </div>
          </div>
        </div>
      </div>

      <atomic-divider />

      <div class="bonuses">
        <h4 class="title">{{ welcomeContent?.bonuses.label }}</h4>

        <div v-if="welcomeContent?.bonuses.items?.length" class="items">
          <div
            class="item"
            :key="itemIndex"
            v-for="(card, itemIndex) in welcomeContent.bonuses.items"
          >
            <div class="title">{{ card.subtitle }}</div>
            <div class="sub-title">{{ card.title }}</div>
            <img class="img" :src="card.image" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openDepositModal() : showModal('register')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base
                type="ghost"
                size="md"
                :url="card.link.url"
              >
                {{ card.link.label }}
              </button-base>
            </div>
          </div>
        </div>
      </div>
    </div>
    <atomic-seo-text v-if="welcomeContent?.seo?.text" v-bind="welcomeContent?.seo?.text" />
  </div>
</template>

<script setup lang='ts'>
  import { storeToRefs } from 'pinia';
  import { WelcomePageInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const welcomeContentRequest = await useAsyncData('welcomeContent', () => queryContent(`welcome-bonuses/${currentLocale.value?.code}`).findOne());
  const welcomeContent:WelcomePageInterface|undefined = welcomeContentRequest.data.value as WelcomePageInterface;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(welcomeContent?.seo);
  let howGetItems = [];
  if (welcomeContent?.howGet) howGetItems = [welcomeContent.howGet.first, welcomeContent.howGet.second, welcomeContent.howGet.third];

  const profileStore = useProfileStore();
  const { openDepositModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style lang="scss">
.promotion {
  @include text-page-max;
  margin: 0 auto;

  hr {
    --margin: #{rem(40px)} 0;
  }

  > .title {
    padding: 0;
    margin: 0 0 rem(8px) 0;
    @include font($heading-7);
    color: var(--white);
  }

  > .sub-title {
    padding: 0;
    margin: 0 0 rem(24px) 0;
    @include font($body-2-paragraph);
    color: var(--gray-400);
  }
}

.steps {
  background: var(--gradient-dark);
  border-radius: 8px;
  display: flex;
  position: relative;
  flex-direction: var(--direction, column);
  padding: var(--padding, #{rem(24px)});
  grid-gap: var(--gap, #{rem(16px)});

  .title {
    @include font($heading-3);
    color: var(--white);
  }

  @include media(sm) {
    --direction: row;
    --padding: #{rem(16px)} #{rem(106px)} #{rem(16px)} #{rem(16px)};
    --gap: #{rem(8px)};
  }

  @include media(md) {
    --padding: #{rem(24px)} #{rem(106px)} #{rem(24px)} #{rem(24px)};
  }

  .items {
    display: var(--display, grid);
    grid-gap: rem(8px);

    @include media(sm) {
      --display: flex;
    }
  }

  .title {
    @include font($heading-3);

    @include media(sm) {
      align-self: center;
      padding-right: rem(8px);
      min-width: rem(120px);
    }
  }

  .text {
    @include font($body-1);
    color: var(--white);
    margin: 0;
  }

  .item {
    background-color: var(--gray-800);
    display: flex;
    align-items: center;
    grid-gap: rem(12px);
    padding: rem(4px) rem(16px);
    border-radius: rem(8px);
    width: 100%;
  }

  .number {
    display: block;
    @include font($heading-7);
    background: var(--gradient-new);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  .img {
    display: block;
    position: var(--position, absolute);
    width: var(--width, #{rem(88px)});
    height: auto;
    top: var(--top, 0);
    right: 0;
    transform: var(--transform, translateY(#{rem(-4px)}));

    @include media(sm) {
      --top: 50%;
      --transform: translateY(-50%) translateX(#{rem(-10px)});
    }
  }
}

.welcome {
  display: grid;

  .title {
    @include font($heading-5);
    color: var(--white);
    margin: var(--margin, 0 0 #{rem(24px)} 0);
  }

  .items {
    display: flex;
    flex-direction: column;
    grid-gap: rem(8px);

    @include media(sm) {
      flex-direction: row;
    }

    .title {
      grid-area: title;
      @include upd-font($heading-3);
      --margin: 0;
    }

    .sub-title {
      grid-area: sub-title;
      @include font($heading-1);
      color: var(--yellow-500);
      padding-top: rem(6px);
    }
  }

  .item {
    border-radius: 16px;
    background-color: var(--bgc, transparent);
    background-image: var(--bgi);
    padding: var(--padding, #{rem(16px)});
    display: grid;
    grid-template-areas:
      "img sub-title"
      "img title"
      "img actions";
    grid-template-columns: auto 1fr;
    grid-gap: rem(8px);
    position: relative;
    width: 100%;

    @include media(sm) {
      grid-template-areas:
        "sub-title"
        "img"
        "title"
        "actions";
      --padding: #{rem(24px)} #{rem(16px)};
    }

    &:nth-of-type(1) {
      --bgc: var(--red-900);
      --bgi: linear-gradient(187.95deg, #950428 44.73%, #28263b 93.88%);

      .arrow {
        display: none;
      }

      @include media(sm) {
        .arrow {
          display: flex;
        }
      }
    }

    &:nth-of-type(2) {
      --bgc: var(--orange-900);
      --bgi: linear-gradient(187.95deg, rgba(17, 20, 28, 0) 44.73%, rgba(17, 20, 28, 0.8) 93.88%);
    }

    &:nth-of-type(3) {
      --bgc: var(--green-900);
      --bgi: linear-gradient(187.95deg, rgba(17, 20, 28, 0) 44.73%, rgba(17, 20, 28, 0.8) 93.88%);
    }

    &:nth-of-type(4) {
      --bgc: var(--violet-900);
      --bgi: linear-gradient(187.95deg, rgba(17, 20, 28, 0) 44.73%, rgba(17, 20, 28, 0.8) 93.88%);

      @include media(sm) {
        .arrow {
          visibility: hidden;
        }
      }
    }

    .title,
    .sub-title {
      @include media(sm) {
        text-align: center;
      }
    }
  }

  .arrow {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: var(--gray-800);
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);
    z-index: 1;
    width: rem(40px);
    height: rem(40px);
    --color: var(--white);

    @include media(sm) {
      top: 50%;
      left: auto;
      right: 0;
      transform: translateX(50%) translateY(-50%) rotate(-90deg);
    }
  }

  .img {
    grid-area: img;
    display: block;
    width: var(--width, #{rem(80px)});
    height: auto;
    align-self: center;

    @include media(sm) {
      margin: auto;
    }

    @include media(md) {
      --width: #{rem(104px)};
    }
  }

  .btn-primary,
  .btn-ghost {
    white-space: nowrap;
    --padding: #{rem(8px)} #{rem(16px)};

    @include media(sm) {
      --padding: #{rem(11px)} #{rem(16px)};
    }
  }

  .actions {
    display: flex;
    align-items: center;
    grid-area: actions;
    margin-top: var(--margin-top, #{rem(8px)});

    .btn-primary {
      @include upd-font($heading-2);
    }

    .btn-ghost {
      @include upd-font($heading-1);
    }

    @include media(sm) {
      flex-direction: column;
      --margin-top: #{rem(24px)};

      .btn-primary,
      .btn-ghost {
        --width: 100%;
      }
    }
  }
}

.bonuses {
  display: grid;

  .title {
    @include font($heading-5);
    color: var(--white);
    margin: var(--margin, 0 0 #{rem(24px)} 0);
  }

  .items {
    display: grid;
    grid-gap: rem(16px);
    overflow: hidden;

    @include media(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    .title {
      @include upd-font($heading-4);
      order: 2;
      --margin: 0;
    }

    .sub-title {
      @include font($heading-1);
      order: 1;
      color: var(--yellow-500);
    }
  }

  .item {
    border-radius: 16px;
    background: var(--bg, var(--gray-800));
    padding: rem(24px) rem(136px) rem(24px) rem(24px);
    display: flex;
    flex-direction: column;
    grid-gap: rem(8px);
    position: relative;

    @include media(md) {
      padding: rem(24px) rem(200px) rem(24px) rem(24px);
      min-height: rem(232px);
      justify-content: center;
    }
  }

  .img {
    display: block;
    width: var(--width, rem(176px));
    height: auto;
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;

    @include media(md) {
      --width: #{rem(232px)};
    }
  }

  .btn-primary,
  .btn-ghost {
    white-space: nowrap;
    --padding: #{rem(11px)} #{rem(8px)};

  }

  .btn-primary {
    @include upd-font($heading-2);

    @include media(xs) {
      --width: 100%;
    }

  }

  .btn-ghost {
    @include upd-font($heading-1);
  }

  .actions {
    display: flex;
    align-items: center;
    margin-top: rem(8px);
    grid-gap: rem(8px);
    order: 3;

    @include media(sm) {
      flex-direction: var(--direction, column);
    }

    @include media(md) {
      --direction: row;
    }
  }
}
</style>
