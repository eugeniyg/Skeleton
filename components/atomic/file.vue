<template>
  <div class="file">
    <div class="file__progress">
      <div class="file__name">{{ props.fileName }}</div>

      <atomic-icon v-if="fileStatus" :class="statusIconClasses" :id="statusIcon"/>

      <button v-if="fileStatus" class="file__rm-btn" @click.prevent="emit('remove')">
        <atomic-icon id="close"/>
      </button>

      <atomic-progress
        @hide-progress="hideProgress"
        v-show="(!fileStatus || isShowProgress) && !props.error"
      />

      <transition name="fade" mode="out-in">
        <div class="file__error" v-if="props.error || props.rejectReason">
          {{ props.error || props.rejectReason}}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id?: string,
    fileName?: string,
    status?: number,
    type?: string,
    createdAt?: string,
    error?: string,
    rejectReason: null|string
  }>();

  const fileStatuses = {
    1: 'approve',
    2: 'pending',
    3: 'canceled',
  };

  const statusIcons = {
    approve: 'done',
    pending: 'eye-visibility',
    canceled: 'warning',
  };

  const emit = defineEmits(['remove']);

  const fileStatus = computed(() => fileStatuses[props.status]);
  const statusIcon = computed(() => statusIcons[fileStatus.value]);

  const isShowProgress = ref(false);

  const statusIconClasses = computed(() => [
    'file__status-icon',
    `status-${fileStatus.value}`,
  ]);

  const hideProgress = () => {
    isShowProgress.value = false;
  };

</script>

<style lang="scss">
.file {
  min-height: rem(32px);
  padding-bottom: rem(8px);

  &__rm-btn {
    @extend %skip-btn;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color .2s ease-in-out;

    &:hover {
      cursor: pointer;

      .icon {
        --color: var(--gray-200);
      }
    }

    .icon {
      --color: var(--white);
    }
  }

  &__status-icon {
    --icon-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.status-pending {
      --color: var(--yellow-500);
    }

    &.status-approve {
      --color: var(--green-500);
    }

    &.status-canceled {
      --color: var(--red-500);
    }
  }

  &__name {
    @include font($body-1);
    color: var(--name-color, var(--white));
    transition: color .4s ease-in-out;
    flex-grow: 1;

    .is-loading & {
      --name-color: var(--gray-400)
    }
  }

  &__progress {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    grid-column-gap: rem(4px);
    position: relative;
    width: 100%;
  }

  &__error {
    @include font($body-1);
    color: var(--red-300);
    width: 100%;
  }
}
</style>
