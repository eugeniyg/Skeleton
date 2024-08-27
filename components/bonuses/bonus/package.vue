<template>
  <div class="bonuses-bonus-package" :class="{'is-active': props.status === 'active'}">
    <div class="bonuses-bonus-package__container">
      <div class="bonuses-bonus-package__header">
        <bonuses-badge-type mode="package"/>
        <bonuses-badge-status :mode="props.status"/>
      </div>
      
      <div class="bonuses-bonus-package__body">
        
        <div class="bonuses-bonus-package__img">
          <atomic-image :src="bonusPackage.image"/>
        </div>
        
        
        <div class="bonuses-bonus-package__name" v-html="marked.parse(bonusPackage.title)"/>
        
        
        <div class="bonuses-bonus-package__tb">
          <template v-for="(bonus, index) in bonusPackage.bonuses" :key="bonus.name">
            <div class="bonuses-bonus-package__tb-th">Bonus {{ index + 1 }}:</div>
            <div class="bonuses-bonus-package__tb-td">
              <bonuses-icon v-if="bonus.status" :status="bonus.status"/>
              
              <template v-if="bonus?.wager?.length">
                <bonuses-wager
                  v-for="(wager, index) in bonus.wager"
                  :key="index"
                  v-bind="wager"
                />
              </template>
              
              <div v-if="bonus?.isNotReceived" class="bonuses-bonus-package__not-received-label">{{ bonus.name }}</div>
              
              <bonuses-fs
                v-if="bonus?.freeSpins"
                :count="bonus?.freeSpins?.count"
                :total-count="bonus?.freeSpins?.totalCount"
                :progress="bonus?.freeSpins?.progress"
              />
            </div>
          </template>
        </div>
        
        <div class="bonuses-bonus-package__footer">
          <bonuses-see-all-link :count="2"/>
          <bonuses-more-link/>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  interface IBonusProps {
    status: 'active'|'availableNextDeposit'|'available';
  }
  
  const props = defineProps<IBonusProps>();
  
  const { bonuses } = useFakeStore();
  
  const bonusPackage = computed(() => bonuses.package);

</script>

<style src="~/assets/styles/components/bonuses/bonus/package.scss" lang="scss"/>
