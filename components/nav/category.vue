<template>
  <div v-click-outside="closeDropdown" class="nav-category">
    <div v-if="!props.hideItems" ref="itemsRef" class="nav-category__items">
      <div
        v-for="{ id, identity, name } in filteredCategories"
        :key="id"
        ref="itemRef"
        class="nav-category__item"
        :class="{
          'is-active': route.params.categoryIdentity === identity,
          'is-no-icon': !gameCategoriesObj[identity]?.icon,
        }"
        :data-identity="identity"
        @click="emit('clickCategory', identity)"
      >
        <atomic-icon :id="gameCategoriesObj[identity]?.icon" class="nav-category__item-icon" />
        <span class="nav-category__item-text">
          {{ gameCategoriesObj[identity]?.label || name }}
        </span>
      </div>
    </div>
    <div class="nav-category__actions">
      <button-categories :is-active="isDropdownShown" :disabled="isCategoriesButtonDisabled" @action="showCategories" />
      <button-providers @click="emit('openProviders')" />

      <ul v-if="isDropdownShown && dropdownItems.length" class="nav-category__dropdown">
        <li
          v-for="{ id, identity, name } in dropdownItems"
          :key="id"
          class="nav-category__dropdown-item"
          :class="{
            'is-active': route.params.categoryIdentity === identity,
            'is-no-icon': !gameCategoriesObj[identity]?.icon,
          }"
          @click="clickCategory(identity)"
        >
          <atomic-icon :id="gameCategoriesObj[identity]?.icon" />
          <span class="nav-category__dropdown-item-text">
            {{ gameCategoriesObj[identity]?.label || name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ICollection } from '@skeleton/api/types';

  const props = defineProps<{
    hideItems?: boolean;
  }>();

  const { openModal } = useModalStore();
  const route = useRoute();
  const itemRef = ref([]);
  const itemsRef = ref();
  const isDropdownShown = ref<boolean>(false);

  const emit = defineEmits(['clickCategory', 'openProviders']);
  const { gameCategoriesObj } = useGlobalStore();
  const { collectionsByCountry } = useGamesStore();
  const filteredCategories = collectionsByCountry.filter(collection => !collection.isHidden);
  const dropdownItems = ref<ICollection[]>([]);
  const isCategoriesButtonDisabled = ref<boolean>(false);

  const showCategories = () => {
    if (window.innerWidth <= 1280) openModal('categories');
    else showDropdown();
  };

  const setDropdownItems = () => {
    if (props.hideItems) {
      dropdownItems.value = [...filteredCategories];
    } else {
      const itemsY = itemsRef.value?.getBoundingClientRect().y;
      const dropdownHiddenItems: string[] = [];

      itemRef.value?.forEach((item: HTMLElement) => {
        const itemY = item.getBoundingClientRect().y;
        const identity = item.dataset?.identity || '';
        if (itemsY !== itemY) {
          dropdownHiddenItems.push(identity);
        }
      });

      dropdownItems.value = filteredCategories.filter(item => dropdownHiddenItems.includes(item.identity));
    }
  };

  const clickCategory = (identity: string) => {
    emit('clickCategory', identity);
    closeDropdown();
  };

  const showDropdown = () => {
    setDropdownItems();
    isDropdownShown.value = true;
  };

  const closeDropdown = () => {
    isDropdownShown.value = false;
  };

  const resizeHandler = () => {
    if (isDropdownShown.value) closeDropdown();
    setDropdownItems();
    isCategoriesButtonDisabled.value = !dropdownItems.value.length;
  };

  onMounted(async () => {
    window.addEventListener('resize', resizeHandler);
    await nextTick(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
  });
</script>

<style src="~/assets/styles/components/nav/category.scss" lang="scss" />
