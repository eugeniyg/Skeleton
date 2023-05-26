<template>
  <div class="avatar-profile">
    <span class="thumb">
      <img
        v-if="profile.avatar"
        class="img"
        :src="profile.avatar"
        alt=""
      >
      <button-edit v-if="props.isEdit" />
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

<style lang="scss">
.avatar-profile {
  padding: 0;
  position: relative;
  transition: box-shadow .2s ease-in-out;
  text-decoration: none;
  align-items: center;
  width: rem(88px);
  height: rem(88px);
  grid-area: avatar;
  align-self: center;

  .thumb {
    position: relative;
    border-radius: 12px;
    background-color: var(--gray-900);
    background-image: url(/img/avatar-bg.png);
    background-position: center;
    background-size: contain;
    @include box(88px);
    display: flex;
    align-items: center;
    justify-content: center;

    > .icon {
      position: absolute;
      width: rem(44px);
      height: rem(44px);
      --color: #718792;
    }

    &:hover {
      box-shadow: 0 0 0 3px var(--gray-900);
      --icon-color: var(--yellow-500);
    }
  }

  .img {
    display: block;
    width: 100%;
    height: auto;
    position: relative;
    z-index: 1;
  }

  .btn-edit {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
  }
}
</style>
