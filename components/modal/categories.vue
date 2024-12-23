<template>
  <vue-final-modal
    v-model="modals.categories"
    class="modal-categories"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="modal-categories__container">
      <div class="modal-categories__header">
        <button-modal-close @close="closeModal('categories')" />
        <div class="modal-categories__header-title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'categories.title') }}
        </div>
      </div>

      <div class="modal-categories__content">
        <div
          v-for="({ id, identity, name }, index) in categories"
          :key="id"
          class="modal-categories__item"
          :data-index="index"
          :class="{
            'is-active': route.params.categoryIdentity === identity,
            'is-no-icon': !gameCategoriesObj[identity]?.icon,
          }"
          @click="emit('clickCategory', identity)"
        >
          <atomic-icon :id="gameCategoriesObj[identity]?.icon" />
          <span>{{ gameCategoriesObj[identity]?.label || name }}</span>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import type { ICollection } from '@skeleton/core/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { gameCategoriesObj } = useGlobalStore();
  const categories = ref<ICollection[]>([]);
  const route = useRoute();

  const emit = defineEmits(['clickCategory']);

  onMounted(async () => {
    const { getCollectionsList } = useGamesStore();
    const gameCollections = await getCollectionsList();
    categories.value = gameCollections.filter(collection => !collection.isHidden);
  });
</script>

<style src="~/assets/styles/components/modal/categories.scss" lang="scss" />
