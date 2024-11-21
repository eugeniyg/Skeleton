<template>
  <div class="tournament-results">
    <div class="tournament-results__header">Results</div>
    
    <div class="tournament-results__places">
      <div class="tournament-results__places-item">
        <atomic-image
          class="tournament-results__places-item-img"
          :src="props.content?.second?.image"
        />
        <div class="tournament-results__places-item-flex">
          <div class="tournament-results__places-item-title">{{ props.content?.second?.title }}</div>
          <div class="tournament-results__places-item-points">{{ props.content?.second?.points }}</div>
        </div>
        <div class="tournament-results__places-item-prize">{{ props.content?.second?.prize }}</div>
      </div>
      
      <div class="tournament-results__places-item">
        <atomic-image
          class="tournament-results__places-item-img"
          :src="props.content?.first?.image"
        />
        
        <div class="tournament-results__places-item-flex">
          <div class="tournament-results__places-item-title">{{ props.content?.first?.title }}</div>
          <div class="tournament-results__places-item-points">{{ props.content?.first?.points }}</div>
        </div>
        <div class="tournament-results__places-item-prize">{{ props.content?.first?.prize }}</div>
      </div>
      
      <div class="tournament-results__places-item">
        <atomic-image
          class="tournament-results__places-item-img"
          :src="props.content?.third?.image"
        />
        <div class="tournament-results__places-item-flex">
          <div class="tournament-results__places-item-title">{{ props.content?.third?.title }}</div>
          <div class="tournament-results__places-item-points">{{ props.content?.third?.points }}</div>
        </div>
        <div class="tournament-results__places-item-prize">{{ props.content?.third?.prize }}</div>
      </div>
    </div>
    
    <div class="tournament-results__tb-scroll">
      <div class="tournament-results__tb">
        <div class="tournament-results__tb-head">
          <div class="tournament-results__tb-th">#</div>
          <div class="tournament-results__tb-th">Player</div>
          <div class="tournament-results__tb-th">Points</div>
          <div class="tournament-results__tb-th">Prize</div>
        </div>
        
        <div class="tournament-results__tb-body">
          <div class="tournament-results__tb-row">
            <div class="tournament-results__tb-td">1</div>
            <div class="tournament-results__tb-td">Twiy_ni***6</div>
            <div class="tournament-results__tb-td">
              <atomic-icon id="arrow-down-compact"/>
              <span>3423</span>
            </div>
            <div class="tournament-results__tb-td">
              <atomic-image src="/img/uploads/tournament/tournament-coin.png"/>
              <span>$350 + 100 FS</span>
            </div>
          </div>
          
          <div class="tournament-results__tb-row"><!-- is-accented -->
            <div class="tournament-results__tb-td">1</div>
            <div class="tournament-results__tb-td">Twiy_ni***6</div>
            <div class="tournament-results__tb-td">
              <atomic-icon id="arrow-down-compact"/>
              <span>3423</span>
            </div>
            <div class="tournament-results__tb-td">
              <atomic-image src="/img/uploads/tournament/tournament-coin.png"/>
              <span>$350 + 100 FS</span>
            </div>
          </div>
          
          <div class="tournament-results__tb-row"><!-- is-accented -->
            <div class="tournament-results__tb-td">1</div>
            <div class="tournament-results__tb-td">Twiy_ni***6</div>
            <div class="tournament-results__tb-td">
              <atomic-icon id="arrow-down-compact"/>
              <span>3423</span>
            </div>
            <div class="tournament-results__tb-td">
              <atomic-image src="/img/uploads/tournament/tournament-coin.png"/>
              <!--<span>$350 + 100 FS</span>-->
              <span class="is-empty">-</span>
            </div>
          </div>
          
          <div class="tournament-results__tb-row is-accented"><!-- is-accented -->
            <div class="tournament-results__tb-td">1</div>
            <div class="tournament-results__tb-td">You</div>
            <div class="tournament-results__tb-td">
              <atomic-icon id="arrow-down-compact"/>
              <span>3423</span>
            </div>
            <div class="tournament-results__tb-td">
              <atomic-image src="/img/uploads/tournament/tournament-coin.png"/>
              <!--<span>$350 + 100 FS</span>-->
              <span class="is-empty">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <atomic-pagination
      v-if="pageMeta?.totalPages && pageMeta.totalPages > 1"
      v-bind="pageMeta"
      @select-page="changePage"
    />
  </div>
</template>

<style src="~/assets/styles/components/tournament/results.scss" lang="scss"/>

<script setup lang="ts">
  import type { IPaginationMeta } from '@skeleton/core/types';
  import type { ITournamentPage } from '~/types';
  
  const props = defineProps<{
    content: ITournamentPage['results'];
  }>();
  
  const pageMeta = ref<IPaginationMeta>();
  
  const changePage = () => {
  };
  
  pageMeta.value = {
    page: 1,
    perPage: 10,
    totalPages: 2,
    totalRows: 3,
  };
</script>
