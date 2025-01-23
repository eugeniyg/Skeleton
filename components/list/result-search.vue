<template>
  <div class="result-search" :class="{ 'is-show': props.isShow }">
    <div class="box">
      <div v-if="!props.items.length" class="header">
        <div class="heading">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.search.emptyLabel') }}</div>
        <div class="text">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.search.emptyText') }}</div>
      </div>

      <div class="items">
        <div v-if="!props.items.length" class="label">
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.search.tryLabel') }}
        </div>

        <div v-for="game in activeItems" :key="game.id" class="item" @click="clickGame(game)">
          <atomic-image :src="getImageUrl(game.customImages, game.images, 'square')" />
          <span>{{ game.name }}</span>
        </div>

        <div v-if="isShowLoadMore" class="footer">
          <button-base type="ghost" size="xs" @click="emit('loadMore')">
            {{ getContent(layoutData, defaultLocaleLayoutData, 'header.search.moreButton') }}
          </button-base>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IGame } from '@skeleton/core/types';

  const props = defineProps<{
    isShow?: boolean;
    items: IGame[];
    defaultItems: IGame[];
    isShowLoadMore?: boolean;
  }>();

  const emit = defineEmits(['loadMore', 'hideSearch']);

  const activeItems = computed(() => (props.items.length ? props.items : props.defaultItems));

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const router = useRouter();

  const { localizePath } = useProjectMethods();
  const clickGame = (gameData: IGame): void => {
    if (gameData.identity === 'betsy-sportsbook-betsy') {
      router.push(localizePath('/betting'));
    } else if (!isLoggedIn.value) {
      router.push(localizePath(`/games/${gameData.identity}${gameData.isDemoMode ? '' : '?real=true'}`));
    } else router.push(localizePath(`/games/${gameData.identity}?real=true`));
    emit('hideSearch');
  };

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { getImageUrl, getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/list/result-search.scss" lang="scss" />
