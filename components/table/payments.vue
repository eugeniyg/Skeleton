<template>
  <div class="payments-grid">
    <div
      class="payments-grid__items"
      v-for="row in items"
    >
      <div
        v-for="({ key, value }, index) in row"
        class="payments-grid__item"
        :class="{
          'payments-grid__item--first-bordered': index === 0,
          'payments-grid__item--last-bordered': (row.length - 1) === index
        }"
      >
        <div class="payments-grid__title">{{ getTitle(titles, key) }}</div>
        
        <template v-if="key === 'limits'">
          <div class="payments-grid__values">
            <template v-for="item in value">
              <div class="payments-grid__value">
                <div class="payments-grid__limit-title">{{ getTitle(limitTitles, item?.key) }}</div>
                <div class="payments-grid__limit-value">{{ formatBalance(item?.currency, item?.value).amount }}</div>
                <div class="payments-grid__limit-currency">{{ item?.currency }}</div>
              </div>
            </template>
          </div>
        </template>
        <template v-else-if="key === 'method'">
          <div class="payments-grid__logo">
            <div class="payments-grid__img">
              <atomic-image :src="`/img/payment-icons/${value}.svg`"/>
            </div>
          </div>
        </template>
        <div class="payments-grid__value" v-else>{{ value }}</div>
      
      </div>
      
      <div class="payments-grid__item payments-grid__action">
        <div class="payments-grid__title">{{ getTitle(titles, 'action') }}</div>
        <div class="payments-grid__btn-holder">
          <button-base type="primary">Deposit</button-base>
        </div>
      </div>
    
    </div>
  </div>
</template>

<script setup lang="ts">
  const { formatBalance } = useProjectMethods();
  
  const titles = [
    { key: 'method', value: 'Payment method'},
    { key: 'type', value: 'Type'},
    { key: 'fee', value: 'Fee'},
    { key: 'processingTime', value: 'Processing time'},
    { key: 'limits', value: 'Limits'},
    { key: 'action', value: 'Action'},
  ];
  
  const limitTitles = [
    { key: 'min', value: 'Min'},
    { key: 'max', value: 'Max'}
  ];
  
  const limitValues = [{
    key: 'min',
    value: 0.00000001,
    currency: 'BTC',
  },
    {
      key: 'max',
      value: 0.00064098,
      currency: 'BTC',
    }];
  
  const items = [
    [
      { key: 'method', value: 'paypal'},
      { key: 'type', value: 'E-Wallet'},
      { key: 'fee', value: '0%'},
      { key: 'processingTime', value: 'Instant'},
      { key: 'limits', value: limitValues }
    ],
    [
      { key: 'method', value: 'visa'},
      { key: 'type', value: 'Credit / debit cards'},
      { key: 'fee', value: '0%'},
      { key: 'processingTime', value: 'Instant'},
      { key: 'limits', value: limitValues }
    ],
    [
      { key: 'method', value: 'usd-coin'},
      { key: 'type', value: 'Virtual currency'},
      { key: 'fee', value: '0%'},
      { key: 'processingTime', value: 'Instant'},
      { key: 'limits', value: limitValues }
    ],
  ];
  
  const getTitle = (titles: {key:string, value:string}[], key: string) => {
    return titles?.find(item => item.key === key)?.value;
  };

</script>

<style src="~/assets/styles/components/table/payments.scss" lang="scss"/>