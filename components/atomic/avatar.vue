<template>
  <div class="avatar" @click="emit('toggle')">
    <span v-if="props.isButton" class="close-decor">
      <atomic-icon id="plus" />
    </span>

    <span class="thumb">
      <img class="img" src="~/assets/img/avatar-bg.png" alt="">
      <atomic-bulb v-if="props.showBulb" />
    </span>

    <div v-if="props.label" class="label">
      {{ props.label }}
    </div>

    <div v-if="props.nickname" class="nickname">
      {{ props.nickname }}
    </div>

    <slot name="progress-bar" />

    <div v-if="props.amount.length" class="amount">
      <span v-for="(item, index) in props.amount" :key="index">
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    showBulb: {
      type: Boolean,
      default: false,
    },
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
    isButton: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['toggle']);
</script>

<style lang="scss">
.avatar {
  padding: var(--padding, 0);
  position: relative;
  background-color: var(--bg, var(--gray-900));
  @extend %flex-column;
  transition: box-shadow .2s ease-in-out;
  text-decoration: none;
  align-items: center;
  width: var(--width, auto);
  user-select: none;

  .close-decor {
    position: absolute;
    z-index: var(--close-decor-index, 1);
    background-color: var(--gray-700);
    border-radius: 12px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 2px 0 #28263B;
    --color: var(--yellow-500);
    cursor: pointer;
    visibility: var(--close-btn-visibility, hidden);

    .icon {
      transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
    }
  }

  .thumb {
    position: relative;
    @include radius(12px);
    @include box(40px);
    display: block;
    background-color: var(--gray-800);
    background-image: url(/assets/img/avatar-bg.png);
    background-position: center;
    background-size: contain;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      bottom: 0;
      display: flex;
      @include box(24px);
      color: var(--color, var(--gray-500));
      transition: color .2s ease-in-out;
      z-index: 0;
    }

    --icon-size: #{rem(18px)};

    &:hover {
      box-shadow: 0 0 0 3px var(--gray-900);
      cursor: pointer;

      .icon {
        --color: var(--yellow-500);
      }
    }
  }

  .img {
    display: block;
    max-width: 100%;
    height: auto;
    position: relative;
    z-index: 1;
  }

  .bulb {
    position: absolute;
    right: 0;
    bottom: rem(-2px);
    z-index: 3;
  }

  > .label {
    @extend %flex-column;
    @include radius(8px);
    @include font($body-0);
    align-items: center;
    padding: 0 rem(8px);
    white-space: nowrap;
    background-color: var(--yellow-500);
    color: var(--black-primary);
    position: relative;
    z-index: 1;
    margin-top: rem(-12px);
  }

  .nickname {
    @include font($heading-2);
    color: var(--color, var(--white));
  }
}
</style>
