<template>
  <div class="card-bet-combo" :class="{'is-open': isOpen}">
    <div class="head">
      <span class="num">#1</span>
      <span class="date">26.07</span>
      <span class="time">16:15</span>
      <button-copy text="123"/>
    </div>

    <div class="content">
      <div class="row">
        <button class="btn-toggle-expand" @click="isOpen = !isOpen">
          <atomic-icon id="ui-arrow_expand-close"/>
        </button>
        <div class="row-title">Combo</div>
        <div class="more-group">
          <span class="type">Soccer</span>
          <div class="tooltip">
            <span class="more">+4 more</span>
            <atomic-tooltip text="Soccer, Dota 2, PUBG, Hokey, CS:GO"/>
          </div>
        </div>
      </div>

      <div class="items">
        <span class="label">Match winner</span>
        <span class="sep"></span>
        <span class="label">Odds</span>
        <span class="value">3.5</span>
        <span class="sep"></span>
        <span class="label">Bet</span>
        <span class="value">0.00000009 mBTC</span>
      </div>

      <atomic-bet-status variant="pending"/>

      <div class="amount">
        <span class="label">Possible win</span>
        <span class="value">0.00000138 mBTC</span>
      </div>
    </div>

    <div class="expand-content">
      <!-- item -->
      <div class="item">
        <div class="row">
          <span class="type">Soccer</span>
          <span class="sep"></span>
          <span class="desc">Beijing Guoan F.C. (virtual_3) vs Shanghai Shenhua (virtual_4)</span>
          <span class="date">
            <span>26.07.2022</span>
            <span>16:15</span>
          </span>
        </div>
        <div class="row-skip">
          <div class="title">Liverpool (Virtual_3)</div>

          <div class="column">
            <span class="label">Match winner</span>
            <span class="sep"></span>
            <span class="label">Odds</span>
            <span class="value">3.5</span>
          </div>
        </div>
      </div>
      <!--/ item -->
      <!-- item -->
      <div class="item">
        <div class="row">
          <span class="type">Soccer</span>
          <span class="sep"></span>
          <span class="desc">Beijing Guoan F.C. (virtual_3) vs Shanghai Shenhua (virtual_4)</span>
          <span class="date">
            <span>26.07.2022</span>
            <span>16:15</span>
          </span>
        </div>
        <div class="row-skip">
          <div class="title">Liverpool (Virtual_3)</div>

          <div class="column">
            <span class="label">Match winner</span>
            <span class="sep"></span>
            <span class="label">Odds</span>
            <span class="value">3.5</span>
          </div>
        </div>
      </div>
      <!--/ item -->
      <!-- item -->
      <div class="item">
        <div class="row">
          <span class="type">Soccer</span>
          <span class="sep"></span>
          <span class="desc">Beijing Guoan F.C. (virtual_3) vs Shanghai Shenhua (virtual_4)</span>
          <span class="date">
            <span>26.07.2022</span>
            <span>16:15</span>
          </span>
        </div>
        <div class="row-skip">
          <div class="title">Liverpool (Virtual_3)</div>

          <div class="column">
            <span class="label">Match winner</span>
            <span class="sep"></span>
            <span class="label">Odds</span>
            <span class="value">3.5</span>
          </div>
        </div>
      </div>
      <!--/ item -->
    </div>
  </div>
</template>

<script setup lang="ts">
  const isOpen = ref<boolean>(true);
</script>

<style lang="scss" src="./style.scss"/>
