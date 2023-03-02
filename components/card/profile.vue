<template>
  <div class="card-profile">
    <atomic-avatar :nickname="userNickname"/>

    <div class="actions">
      <button-base type="primary" size="md" @click="openDepositModal">
        <atomic-icon id="plus"/>{{ getContent(profileMenuContent, defaultLocaleProfileMenuContent, 'depositButton') }}
      </button-base>

      <button-base
        v-if="getContent(profileMenuContent, defaultLocaleProfileMenuContent, 'profileButton')"
        type="secondary"
        size="md"
        :url="getContent(profileMenuContent, defaultLocaleProfileMenuContent, 'profileButton.url')"
      >
        {{ getContent(profileMenuContent, defaultLocaleProfileMenuContent, 'profileButton.label') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { sidebarContent, defaultLocaleSidebarContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const profileMenuContent = sidebarContent?.profileMenu;
  const defaultLocaleProfileMenuContent = defaultLocaleSidebarContent?.profileMenu;
  const profileStore = useProfileStore();
  const { openDepositModal } = useLayoutStore();
  const { userNickname } = storeToRefs(profileStore);
</script>

<style lang="scss">
.card-profile {
  @extend %flex-column;
  grid-row-gap: rem(16px);
  padding: 0 rem(4px);

  .is-compact & {
    grid-row-gap: rem(8px);
    padding: 0;
  }

  .avatar {
    --padding: #{rem(12px) rem(16px)};
  }

  .actions {
    @extend %flex-column;
    grid-row-gap: rem(8px);
  }

  .btn-primary, .btn-secondary {
    --width: 100%
  }

  .btn-secondary {
    --bg: var(--gray-900)
  }

  .is-compact & {
    @include media(l) {
      .btn-secondary, .nickname, .progress-bar {
        display: none;
      }

      .btn-primary {
        font-size: 0;

        --width: #{rem(40px)};
        --height: #{rem(40px)};
        --padding: 0;
        --bg: var(--gray-900);

        .icon {
          transform: translateX(#{rem(2px)});
          color: var(--yellow-500);
        }
      }

      .avatar {
        --padding: 0;
        --bg: transparent;
        --width: fit-content;
      }
    }
  }
}
</style>
