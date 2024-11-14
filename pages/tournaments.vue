<template>
  <div class="tournaments">
    <div class="tournaments__heading">Tournaments</div>
    <div class="tournaments__sub-heading">Compete and Conquer. Unleash Your Skills in Our Thrilling Tournaments.</div>
    
    <div class="tournaments__grid">
      <tournament-card-active/>
      <tournament-card-active/>
      <tournament-card-active/>
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
