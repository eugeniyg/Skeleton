<template>
  <div class="card-bet-ordinar">
    <div class="head">
      <span class="num">#1</span>
      <span class="date">26.07</span>
      <span class="time">16:15</span>

      <button-copy text="77"/>
    </div>

    <div class="content">
      <div class="row">
        <span class="type">Soccer</span>
        <span class="sep"></span>
        <span class="desc">Beijing Guoan F.C. (virtual_3) vs Shanghai Shenhua (virtual_4)</span>

        <div class="status">
          <span class="date">26.07</span>
          <span class="time">16:15</span>
          <span class="sep"></span>

          <atomic-bet-status variant="pending"/>
        </div>
      </div>

      <div class="title">Liverpool (Virtual_3)</div>

      <div class="items">
        <span class="label">Match winner</span>
        <span class="sep"></span>
        <span class="label">Odds</span>
        <span class="value">3.5</span>
        <span class="sep"></span>
        <span class="label">Bet</span>
        <span class="value">0.00000009 mBTC</span>
        <span class="pusher"></span>

        <div class="amount">
          <span class="label">Possible win</span>
          <span class="value">0.00000138 mBTC</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss"/>
