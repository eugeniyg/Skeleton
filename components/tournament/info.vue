<template>
  <div class="tournament-info">
    <div class="tournament-info__title">{{ props.tournamentContent?.info?.title }}</div>

    <div class="tournament-info__items">
      <div class="tournament-info__item">
        <atomic-image v-if="prizeImage" :src="prizeImage" />
        <span class="tournament-info__item-label">
          {{
            getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'info.prizesCount.label')
          }}:
        </span>

        <span v-if="props.tournamentDefiniteData" class="tournament-info__item-count">
          {{ props.tournamentDefiniteData.prizes?.length || '-' }}
        </span>
        <span v-else class="tournament-info__spinner" />
      </div>

      <div class="tournament-info__item">
        <atomic-image v-if="gamesImage" :src="gamesImage" />
        <span class="tournament-info__item-label">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'info.gamesCount.label') }}:
        </span>

        <span v-if="props.gamesMeta" class="tournament-info__item-count">{{ props.gamesMeta.totalRows }}</span>
        <span v-else class="tournament-info__spinner" />
      </div>
    </div>

    <div
      ref="descriptionRef"
      class="tournament-info__description"
      :class="{ 'is-expanded': isExpanded }"
      v-html="
        DOMPurify.sanitize(marked.parse(props.tournamentContent?.info?.text || '') as string, {
          FORBID_TAGS: ['style'],
        })
      "
    />

    <button-base v-if="displayMoreBtn" class="tournament-info__more-btn" type="ghost" @click="expandDescription">
      <span>{{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'info.more') }}</span>
      <atomic-icon id="arrow-expand-close" />
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentCommon, ITournamentPage } from '~/types';
  import DOMPurify from 'isomorphic-dompurify';
  import { marked } from 'marked';
  import type { IPaginationMeta, ITournament } from '@skeleton/api/types';

  const props = defineProps<{
    gamesMeta: IPaginationMeta | undefined;
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    tournamentContent: Maybe<ITournamentPage>;
    tournamentDefiniteData: Maybe<ITournament>;
  }>();

  const prizeImage = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'info.prizesCount.image')
  );
  const gamesImage = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'info.gamesCount.image')
  );

  const descriptionRef = ref();
  const displayMoreBtn = ref(false);
  const isExpanded = ref(false);

  const checkDisplayMoreBtn = async () => {
    await nextTick();
    if (descriptionRef.value) {
      displayMoreBtn.value = descriptionRef.value?.scrollHeight > descriptionRef.value?.offsetHeight;
    }
  };

  const expandDescription = () => {
    isExpanded.value = true;
    displayMoreBtn.value = false;
  };

  watch(
    () => props.tournamentContent,
    () => {
      checkDisplayMoreBtn();
    }
  );

  onMounted(() => {
    window.addEventListener('resize', checkDisplayMoreBtn);
    nextTick(() => checkDisplayMoreBtn());
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDisplayMoreBtn);
  });
</script>

<style src="~/assets/styles/components/tournament/info.scss" lang="scss" />
