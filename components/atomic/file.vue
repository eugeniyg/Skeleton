<template>
  <div class="file" :class="fileClasses">
    <div class="file__progress">
      <div class="file__name">{{ props.title }}</div>

      <atomic-icon :class="statusIconClasses" :id="statusIcon"/>

      <button class="file__rm-btn" @click.prevent="removeFile">
        <atomic-icon id="close"/>
      </button>

      <atomic-progress
        @change-status="ChangeFileStatusDemo"
        @hide-progress="hideProgress"
        v-show="isShowProgress"
      />

      <transition name="fade" mode="out-in">
        <div class="file__error" v-if="isErrorText">
          {{ isErrorText }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  const fileStatuses = {
    error: 'info',
    unverified: 'info',
    pending: 'clock',
    seen: 'eye-visibility',
    verified: 'done',
  };

  const emit = defineEmits([
    'rm-file',
    'file-has-error',
    'file-error-off',
  ]);

  const props = defineProps<{
    title: string,
    size: string,
  }>();

  const fileStatus = ref('pending');
  const statusIcon = ref(fileStatuses.pending);
  const isPrepared = ref(false);
  const isError = ref(false);
  const isLoading = ref(true);
  const isShowProgress = ref(true);
  const fileHasError = ref(false);

  const isErrorText = ref('');

  const fileClasses = computed(() => ({
    'is-prepared': isPrepared.value,
    'is-error': isError.value,
    'is-loading': isLoading.value,
  }));

  const statusIconClasses = computed(() => [
    'file__status-icon',
    `status-${fileStatus.value}`,
  ]);

  const removeFile = () => {
    emit('rm-file', props.title);
    if (fileHasError.value) {
      emit('file-error-off');
    }
  };

  const enableError = () => {
    emit('file-has-error');
    fileHasError.value = true;
  };

  const ChangeFileStatusDemo = () => {
    const keys = Object.keys(fileStatuses);
    const key = keys[Math.floor(Math.random() * keys.length)];
    fileStatus.value = key;
    statusIcon.value = fileStatuses[key];
    isLoading.value = false;

    switch (key) {
    case 'unverified':
      isErrorText.value = 'Unforturately, we do not accept scanned documents. Please upload a photo pf your Passport.';
      enableError();
      break;
    case 'error':
      isErrorText.value = 'File has an error';
      enableError();
      break;
    default:
      isErrorText.value = '';
    }
  };

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

    &.status-error {
      --color: var(--red-500);
    }

    &.status-pending {
      --color: var(--yellow-500);
    }

    &.status-seen {
      --color: var(--yellow-500);
    }

    &.status-verified {
      --color: var(--green-500);
    }

    &.status-unverified {
      --color: var(--orange-500);
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
