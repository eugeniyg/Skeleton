<template>
  <form class="form-deposit">
    <form-input-number
      :hint="{message: 'Min deposit = 20 EUR, max deposit = 5000 EUR'}"
      label="Deposit sum"
      name="name1"
      :value="selectedPill"
      :is-bigger="true"
    >
      <template v-slot:pills>
        <list-pills @select="selectedPill = $event" :items="[50, 100, 500, 1000]" :selected="selectedPill"/>
      </template>
    </form-input-number>

    <form-input-card/>
    <atomic-divider/>
    <atomic-bonus/>
    <atomic-divider/>
    <div class="row">
      <form-input-toggle name="bonus-code" :is-checked="hasBonusCode" @input="hasBonusCode = $event">I have bonus code</form-input-toggle>
      <form-input-text v-if="hasBonusCode" placeholder="Enter bonus code" name="bonus-code"></form-input-text>
    </div>
    <button-base type="primary" size="md">Deposit 50 EUR</button-base>
  </form>
</template>

<script setup lang="ts">
  const selectedPill = ref<number>(50);
  const hasBonusCode = ref<boolean>(false);
</script>

<style lang="scss" src="./style.scss"/>
