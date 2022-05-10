<template>
  <div class="card-profile" :class="{'is-compact' : props.isCompact}">
    <atomic-avatar :nickname="props.avatarItems.nickname" :label="props.avatarItems.label">
      <template v-slot:progress-bar>
        <profile-progress-bar/>
      </template>
    </atomic-avatar>

    <div class="actions">
      <button-base type="primary" size="md">
        <atomic-icon id="ui-plus"/>Deposit
      </button-base>

      <button-base type="secondary" size="md">Profile</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from '@vue/runtime-core';

  const props = defineProps({
    isCompact: {
      type: Boolean,
      default: false,
    },
    avatarItems: {
      type: Object as PropType<{nickname: string, label: string}>,
      default: () => ({
        nickname: '',
        label: '',
      }),
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
