<template>
  <div class="tournaments">
    <div class="tournaments__heading">Tournaments</div>
    <div class="tournaments__sub-heading">Compete and Conquer. Unleash Your Skills in Our Thrilling Tournaments.</div>
    
    <div class="tournaments__grid">
      <tournament-card-active expiredAt="2024-11-15T08:15:43.659Z"/>
      <tournament-card-active expiredAt="2024-12-07T08:15:43.659Z"/>
      <tournament-card-active expiredAt="2024-11-07T08:15:43.659Z"/>
    </div>
    
    <div class="tournaments__grid-heading">Finished</div>
    <div class="tournaments__grid">
      <tournament-card-finished/>
      <tournament-card-finished/>
      <tournament-card-finished/>
    </div>
    
    
  </div>
  
  
  
  
</template>

<script setup lang="ts">
</script>

<style src="~/assets/styles/pages/tournaments.scss" lang="scss" />
