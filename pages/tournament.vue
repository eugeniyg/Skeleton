<template>
  <div class="tournament">
    <tournament-slider
      v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'cards')"
      :content="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'cards')"
    />
    
    <div class="tournament__container">
      <tournament-info
        v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'info')"
        :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'info')"
      />
      
      <tournament-results
        v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'results')"
        :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'results')"
      />
      
      <tournament-participate
        v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'participate')"
        :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'participate')"
      />
      
      <tournament-terms
        v-if="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'terms')"
        :title="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'terms.title')"
        :content="getContent(pageContent?.currentLocaleData,  pageContent?.defaultLocaleData, 'terms.content')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentPage } from '~/types';
  
  const { getContent } = useProjectMethods();
  
  const contentParams = {
    contentKey: 'tournamentPageContent',
    contentRoute: ['pages', 'tournament'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ITournamentPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);
</script>

<style src="~/assets/styles/pages/tournament.scss" lang="scss"/>
