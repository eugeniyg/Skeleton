<template>
  <div class="avatar-profile">
    <span class="thumb">
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
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"/>
