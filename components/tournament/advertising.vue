<template>
  <div class="tournament-advertising">
    <div class="tournament-advertising__content">
      <div class="tournament-advertising__title">{{ props.content?.title }}</div>
      <div class="tournament-advertising__prize">{{ props.content?.reward }}</div>
    </div>

    <div class="tournament-advertising__actions">
      <button-base
        v-if="props.content?.button?.url"
        size="md"
        type="primary"
        :url="props.content.button.url"
        :target-blank="props.content.button.targetBlank"
      >
        {{ props.content?.button?.label }}
      </button-base>

      <button-base v-else size="md" type="primary" @click="handleClick">
        {{ props.content?.button?.label }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentPage } from '~/types';

  const props = defineProps<{
    content: Maybe<ITournamentPage['advertising']>;
  }>();

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();
  const handleClick = (): void => {
    if (isLoggedIn.value) openWalletModal('deposit');
    else openModal('sign-up');
  };
</script>

<style src="~/assets/styles/components/tournament/advertising.scss" lang="scss" />
