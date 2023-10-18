<template>
  <div class="payments">
    <div class="payments-page__title">
      <h5>Payments</h5>
    </div>
    
    <div
      class="payments-page__description"
      :class="{'is-expanded': !showExpand}"
      ref="descriptionElem"
    >
      <p>Becoming a client of Slotsbet is simple: complete a short registration form, make your first deposit, and get
        access to an amazing collection of over 3000 high-quality Bitcoin casino games: Blackjack, Poker, Slots,
        Baccarat, and many more! From lottery to live dealer games, you can be sure that you are getting the very best
        thing currently available on the market.</p>
    </div>
    
    <button-base
      class="btn-expand"
      v-show="showExpand"
      @click="expandDescription"
    >
      <span>More info</span>
      <atomic-icon id="arrow_expand-close"/>
    </button-base>
    
    <div class="payments-page__tabs">
      <div
        class="payments-page__tabs-item"
        v-for="{id, title} in paymentsTabs"
        :key="id"
        :class="{'is-active': id === selectedPaymentsTab}"
        @click="changePaymentsTab(id)"
      >{{ title }}
      </div>
    </div>
    
    <table-payments/>
  
  </div>
</template>

<script setup lang="ts">
  const paymentsTabs = [
    {
      title: 'Deposit',
      id: 'deposit'
    },
    {
      title: 'Withdraw',
      id: 'withdraw',
    },
  ];
  
  const selectedPaymentsTab = ref<string>(paymentsTabs[0].id);
  const showExpand = ref(true);
  
  const descriptionElem = ref();
  let resizeObserver: any;
  
  const changePaymentsTab = (tabId: string): void => {
    if (selectedPaymentsTab.value === tabId) return;
    selectedPaymentsTab.value = tabId;
  };
  
  const expandDescription = () => {
    showExpand.value = false
  };
  
  onMounted(() => {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if(entry.target?.scrollHeight > entry.target?.clientHeight && !showExpand.value) {
          showExpand.value = true
        }
      }
    });
    
    resizeObserver.observe(descriptionElem.value);
  });
  
  onBeforeUnmount(() => {
    resizeObserver.unobserve(descriptionElem.value);
  });
  
</script>

<style src="~/assets/styles/pages/payments.scss" lang="scss"/>