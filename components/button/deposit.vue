<template>
  <button
    class="btn-deposit"
    :class="{'is-active': isActive}"
    @click="makeActive"
    v-click-outside="makeInactive"
  >
    <atomic-icon id="wallet"/>
    <span>
      {{ getContent(layoutData, defaultLocaleLayoutData, 'header.depositButton') }}
    </span>
  </button>
</template>

<script setup lang="ts">
  const { openDepositModal } = useLayoutStore();
  const { getContent } = useProjectMethods();
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const isActive = ref<boolean>(false);

  const makeActive = () => {
    isActive.value = true;
    openDepositModal();
  };

  const makeInactive = () => {
    isActive.value = false;
  };
</script>

<style src="~/assets/styles/components/button/deposit.scss" lang="scss" />

