<template>
  <div v-if="globalComponentsContent?.promotions || defaultLocaleGlobalComponentsContent?.promotions" class="group-promotions">
    <atomic-icon :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'promotions.icon')"/>

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'promotions.label') }}
    </h2>

    <div class="group-promotions__list">
      <div
        class="group-promotions__item"
        v-for="(promotion, index) in getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'promotions.items')"
        :key="index"
        :class="{ 'hovered': hoverCard === index }"
        @click="clickCard(index)"
      >
        <div class="img" :style="backgroundImage(promotion.image)"/>

        <div class="content">
          <div class="title">{{ promotion.title }}</div>
          <div class="sub-title">{{ promotion.description }}</div>

          <div class="actions">
            <button-base
              type="primary"
              size="md"
              @click="isLoggedIn ? openDepositModal() : showModal('register')"
            >
              {{ promotion.buttonLabel }}
            </button-base>

            <nuxt-link
              class="link-more"
              :to="localizePath(promotion.link.url)"
            >
              {{ promotion.link.label }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script  setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = globalStore;

  const { localizePath, getContent } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openDepositModal } = useLayoutStore();

  const backgroundImage = (img:string):string => `background-image:url(${img})`;
  const hoverCard = ref<number|undefined>(undefined);
  const { isMobile } = storeToRefs(globalStore);
  const clickCard = (index: number):void => {
    if (isMobile.value) {
      hoverCard.value = hoverCard.value === index ? undefined : index;
    }
  };

  const clickOutside = (e:any):void => {
    if (e.target.closest('.group-promotions__item')) return;
    hoverCard.value = undefined;
  };

  onMounted(() => {
    document.addEventListener('click', clickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutside);
  });
</script>

<style lang="scss">
.group-promotions {
  display: grid;
  align-items: center;
  grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-column-gap: var(--column-gap, #{rem(8px)});
  grid-row-gap: var(--row-gap, #{rem(16px)});

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
  }

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    grid-area: icon;
    margin-left: rem(16px);
    --icon-size: #{rem(20px)};
    --color: var(--gray-400);

    @include media(sm) {
      margin-left: rem(24px);
    }
  }

  > .title {
    flex-grow: 1;
    grid-area: heading;
    @include font($heading-4);
    color: var(--white);
    margin: 0;
  }

  > &__list {
    grid-area: items;
    display: var(--display, grid);
    align-items: normal;
    overflow-x: auto;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--items-column-gap, #{rem(8px)});

    &::-webkit-scrollbar {
      display: none;
    }

    @include media(sm) {
      grid-template-columns: repeat(4, 1fr);
      --items-column-gap: #{rem(16px)}
    }
  }

  &__item {
    width: 100%;
    height: auto;
    padding: rem(24px) rem(16px) rem(16px) rem(16px);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    text-align: center;

    &:before {
      border-radius: 8px;
      position: absolute;
      content: '';
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--gray-900);
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
      z-index: 0;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      opacity: 0;
      transition: opacity .2s ease-in-out;
      background-image: linear-gradient(180deg, rgba(17, 20, 28, 0) 0%, var(--black-primary) 100%);
      filter: blur(2px)
    }

    .img {
      position: relative;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      transition: all .2s ease-in-out;
      z-index: 1;
      height: var(--img-height, #{rem(128px)});

      @include media(md) {
        --img-height: #{rem(192px)}
      }
    }

    .content, .actions {
      position: relative;
      justify-content: center;
      flex-direction: column;
      display: flex;
    }

    .content {
      position: relative;
      transform: translateY(0%);
      transition: all .2s ease-in-out;
      z-index: 4;
    }

    .actions {
      position: absolute;
      width: 100%;
      grid-gap: rem(6px);
      height: rem(86px);
      padding-top: rem(16px);
      top: 100%;
      transition: all .2s ease-in-out;
      transform: translateY(100%);
      user-select: none;
    }

    @include media(md) {
      &:hover {
        .actions {
          transform: translateY(0);
        }

        .content {
          transform: translateY(calc(-86px));
        }

        &:after {
          opacity: 1;
        }
      }
    }

    &.hovered {
      .actions {
        transform: translateY(0);
      }

      .content {
        transform: translateY(calc(-86px));
      }

      &:after {
        opacity: 1;
      }
    }

    .title {
      @include font($heading-3);
      color: var(--white);
      margin-bottom: rem(4px);
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);

      @include media(md) {
        @include upd-font($heading-4);
      }
    }

    .sub-title {
      @include font($body-1);
      color: var(--white);

      @include media(md) {
        @include upd-font($body-2);
      }
    }

    .btn-primary {
      width: 100%;
    }

    .link-more {
      @include font($heading-1);
      background-color: var(--bgc, transparent);
      color: var(--color, var(--gray-300));
      text-decoration: none;
      padding: rem(4px) rem(16px);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all .2s ease-in-out;

      @include use-hover {
        &:hover {
          --bgc: var(--gray-800);
          --color: var(--yellow-500);
        }
      }

      &:active {
        --bgc: var(--gray-700);
        --color: var(--yellow-500);
      }
    }
  }
}
</style>
