<template>
  <div class="card-profile">
    <atomic-avatar :nickname="userNickname" :label="props.avatarItems.label">
      <template v-slot:progress-bar>
        <profile-progress-bar/>
      </template>
    </atomic-avatar>

    <div class="actions">
      <button-base type="primary" size="md" @click="openDepositModal">
        <atomic-icon id="ui-plus"/>Deposit
      </button-base>

      <button-base type="secondary" size="md" url="/profile/info">
        Profile
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from '@vue/runtime-core';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    avatarItems: {
      type: Object as PropType<{nickname: string, label: string}>,
      default: () => ({
        nickname: '',
        label: '',
      }),
    },
  });

  const profileStore = useProfileStore();
  const { openDepositModal } = useLayoutStore();
  const { userNickname } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"/>
