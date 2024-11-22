<template>
  <div class="tournaments">
    <div class="tournaments__title">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
    </div>
    
    <div class="tournaments__description">
      {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'description') }}
    </div>
    
    <div class="tournaments__grid">
      <tournament-card-active
        v-for="(card, index) in cards?.slice(0, 2)"
        :key="index"
        v-bind="card"
      />
    </div>
    
    <div class="tournaments__finished-title">Finished</div>
    
    <div class="tournaments__grid">
      <tournament-card-finished
        v-for="(card, index) in cards?.slice(0, 2)"
        :key="index"
        v-bind="card"
      />
    </div>
    
    <!--
    <atomic-empty
      variant="search"
      title="There is no data yet!"
      sub-title="You currently do not have any active tournament"
    />
    -->
    
    <atomic-divider/>
    
    <tournament-how-to-take-part
      v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'howToTakePart')"
      :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'howToTakePart')"
    />
  
  </div>

</template>

<script setup lang="ts">
  import type { ITournamentsPage } from '~/types';
  
  const { getContent } = useProjectMethods();
  
  const contentParams = {
    contentKey: 'tournamentsPageContent',
    contentRoute: ['pages', 'tournaments'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ITournamentsPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
  
  const cards = computed(() => {
    return getContent(pageContent?.value?.currentLocaleData, pageContent?.value?.defaultLocaleData, 'cards');
  });
</script>

<style src="~/assets/styles/pages/tournaments.scss" lang="scss"/>
