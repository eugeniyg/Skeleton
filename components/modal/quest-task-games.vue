<template>
  <vue-final-modal
    :modelValue="showModal"
    class="modal-quest-task-games"
    :clickToClose="false"
    @clickOutside="emit('closeModal')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @closed="closedHandler"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')"/>

        <div class="title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.gamesLabel') }}
        </div>
      </div>

      <div class="modal-quest-task-games__content">
        <div class="modal-quest-task-games__item" v-for="game in props.games">
          <span class="modal-quest-task-games__link" @click="goToGame(game)">{{ game.name }}</span>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IGame } from "@skeleton/core/types";

  const props = defineProps<{
    showModal: boolean;
    games: IGame[];
  }>();

  const emit = defineEmits(['closeModal']);

  const { getContent, localizePath } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);

  const router = useRouter();
  const { closeModal } = useLayoutStore();
  const { closeTasksModal } = useQuestsStore();
  const closeGame = ref('');
  const goToGame = (game: IGame): void => {
    closeGame.value = game.identity;
    emit('closeModal');
  }

  const closedHandler = (): void => {
    if (closeGame.value) {
      closeTasksModal();
      closeModal('questsHub');
      router.push(localizePath(`/games/${closeGame.value}?real=true`));
    }
  }
</script>

<style src="~/assets/styles/components/modal/quest-task-games.scss" lang="scss" />