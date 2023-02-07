<template>
  <div class="card-profile">
    <atomic-avatar :nickname="userNickname"/>

    <balance-extended/>

    <div class="actions">
      <button-base type="primary" size="md" @click="openDepositModal">
        <atomic-icon id="plus"/>{{ profileMenuContent?.depositButton}}
      </button-base>

      <!--
      <button-base
        v-if="profileMenuContent?.profileButton"
        type="secondary"
        size="md"
        :url="profileMenuContent.profileButton.url"
      >
        {{ profileMenuContent.profileButton.label}}
      </button-base>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { sidebarContent } = useGlobalStore();
  const profileMenuContent = sidebarContent?.profileMenu;
  const profileStore = useProfileStore();
  const { openDepositModal } = useLayoutStore();
  const { userNickname } = storeToRefs(profileStore);
</script>

<style lang="scss">
.card-profile {
  padding: rem(20px) rem(12px) rem(12px) rem(12px);
  background: var(--gray-900);
  border-radius: 16px;

  .nickname {
    margin-top: 12px;
    margin-bottom: 4px;
    @include upd-font($body-1);
    --color: var(--gray-300);
  }

  .is-compact & {
    grid-row-gap: rem(8px);
    padding: 0;
  }

  .avatar {
    --padding: 0;
  }

  .actions {
    @extend %flex-column;
    grid-row-gap: rem(8px);
    margin-top: 20px;
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
