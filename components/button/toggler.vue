<template>
  <div class="toggler-btn">
    <button-base
      v-for="(button, index) in props.items"
      :key="index"
      :isActive="$route.path === localizePath(button.url) || ($route.query.category && index === 0)"
      @click="selectTab(button.url)"
    >
      <atomic-icon :id="button.icon" />
      <span class="text">{{ button.label }}</span>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();
  const router = useRouter();
  const { localizePath } = useProjectMethods();

  const selectTab = (url: string):void => {
    if (url === '/betting' && !isLoggedIn.value) showModal('register');
    else router.push(localizePath(url));
  };
</script>

<style lang="scss">
.toggler-btn {
  padding: var(--padding, #{rem(16px)} #{rem(31px)} #{rem(16px)} #{rem(16px)});
  grid-gap: 3px;
  display: flex;
  flex-direction: var(--direction, row);
  justify-self: center;
  background-color: var(--gray-900);
  flex-grow: 1;
  width: 100%;

  .btn {
    box-shadow: var(--shadow, none);
    overflow: hidden;
    flex-grow: 1;

    --color: var(--white);
    --padding: #{rem(4px) rem(12px)};
    --btn-border-radius: 8px;

    @include use-hover {
      &:hover {
        --bg: var(--gray-700);
      }
    }

    &:active, &.is-active {
      --bg: var(--gray-700);
      --color: var(--yellow-500);
      --text-color: var(--yellow-500);
      --icon-color: var(--yellow-500);
    }
  }

  .text {
    @include font($body-2);
    @extend %text-elipsis;
    display: var(--text-display, block);
    color: var(--color, var(--white));
    transition: color .4s ease-in-out;
  }

  .is-compact & {
    @include media(l) {
      border-radius: 8px;
      width: fit-content;
      align-items: center;

      --direction: column;
      --padding: #{rem(4px)};
      --margin: 0;
      --text-display: none;

      .btn {
        @include box(32px);
        --padding: 0;
      }

      .icon {
        --icon-size: #{rem(22px)};
      }
    }
  }
}
</style>
