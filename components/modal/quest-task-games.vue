<template>
  <vue-final-modal
    class="modal-quest-task-games"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('quest-task-games')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('quest-task-games')" />

        <div class="title">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'gamesLabel') }}
        </div>
      </div>

      <div class="modal-quest-task-games__content">
        <div v-for="game in props.games" :key="game.id" class="modal-quest-task-games__item">
          <span class="modal-quest-task-games__link" @click="goToGame(game)">{{ game.name }}</span>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IGame } from '@skeleton/core/types';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['questTasks']>;
    defaultLocaleData: Maybe<IModalsContent['questTasks']>;
    games: IGame[];
  }>();

  const { getContent, localizePath } = useProjectMethods();
  const router = useRouter();
  const { closeAllModals, closeModal } = useModalStore();
  const goToGame = async (game: IGame): Promise<void> => {
    await closeAllModals();
    await router.push(localizePath(`/games/${game.identity}?real=true`));
  };
</script>

<style src="~/assets/styles/components/modal/quest-task-games.scss" lang="scss" />
