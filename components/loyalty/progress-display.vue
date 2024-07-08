<template>
  <div class="loyalty-progress-display">
    <div class="loyalty-progress-display__images">
      <atomic-image class="loyalty-progress-display__images-back-bg" src="/img/uploads/loyalty-rays.png" />
      <atomic-image class="loyalty-progress-display__images-face-bg" src="/img/uploads/loyality-sign-bg.png" />
    </div>
    
    <div class="loyalty-progress-display__container">
      <div class="loyalty-progress-display__levels">
        <div class="loyalty-progress-display__levels-prev">
          <span class="loyalty-progress-display__levels-prev-label">Level:</span>
          <atomic-icon id="flash" class="loyalty-progress-display__levels-prev-icon"/>
          <span class="loyalty-progress-display__levels-prev-value">13</span>
        </div>
        
        <div class="loyalty-progress-display__levels-next">
          <span class="loyalty-progress-display__levels-next-label">Next:</span>
          <atomic-icon id="flash" class="loyalty-progress-display__levels-next-icon"/>
          <span class="loyalty-progress-display__levels-next-value">14</span>
        </div>
        
        <loyalty-progress/>
        
        <div class="loyalty-progress-display__levels-points">
          <div class="loyalty-progress-display__levels-points-prev">
            <span class="loyalty-progress-display__levels-points-prev-value">37</span>
            <span class="loyalty-progress-display__levels-points-prev-label">Points</span>
          </div>
          <div class="loyalty-progress-display__levels-points-divider">/</div>
          <div class="loyalty-progress-display__levels-points-next">
            <span class="loyalty-progress-display__levels-points-next-value">75</span>
            <span class="loyalty-progress-display__levels-points-next-label">Points</span>
          </div>
        </div>
      </div>
    
    </div>
  </div>
</template>

<style src="~/assets/styles/components/loyalty/progress-display.scss" lang="scss" />
<script setup lang="ts">
</script>
