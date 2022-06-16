<template>
  <div class="avatar-user">
    <div class="row">
      <span class="thumb">
        <img class="img" src="~/assets/img/avatar.png" alt="" />
      </span>

      <div v-if="props.label" class="label">{{ props.label }}</div>
    </div>

    <div class="row">
      <div class="nickname">{{ publicNickname }}</div>

      <div v-if="props.amount.length" class="amount">
        <span v-for="(item, index) in props.amount" :key="index">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '',
    },
    amount: {
      type: Array,
      default: () => [],
    },
  });

  const profileStore = useProfileStore();
  const { publicNickname } = storeToRefs(profileStore);
</script>

<style lang="scss" src="./style.scss"/>
