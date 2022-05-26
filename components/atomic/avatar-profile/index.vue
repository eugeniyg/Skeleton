<template>
  <div class="avatar-profile">
    <span class="thumb">
      <atomic-icon id="ui-user"/>
      <img
        v-if="profile.avatar"
        class="img"
        :src="profile.avatar"
        alt=""
      />
      <button-edit v-if="props.isEdit"/>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    isEdit: {
      type: Boolean,
      default: true,
    },
  });
  const userStore = useUserStore();
  const { profile } = storeToRefs(userStore);
</script>

<style lang="scss" src="./style.scss"/>
