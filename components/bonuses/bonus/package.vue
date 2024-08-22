<template>
  <div class="bonus-package" :class="{'is-active': props.isActive }">
    <div class="bonus-package__container">
      <div class="bonus-package__header">
        
        <bonuses-badge variant="package"/>
        <bonuses-badge-status status="active"/>
        
        <!--
        <bonuses-badge-status
          status="available"
          is-next-deposit
        />
        -->
        
        <!--
        <bonuses-badge-status
          status="future"
        />
        -->
        
        
        
        
        
        
        <bonuses-badge variant="cashback"/>
        
        
      </div>
      
      <div class="bonus-package__body">
        <bonuses-progress :value="5"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
  }>();
</script>

<style src="~/assets/styles/components/bonuses/bonus/package.scss" lang="scss"/>
