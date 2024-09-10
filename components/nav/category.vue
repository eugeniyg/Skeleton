<template>
  <div
    class="nav-category"
    v-click-outside="closeDropdown"
  >
    <div
      v-if="!props.hideItems"
      class="nav-category__items" ref="itemsRef"
    >
      <div
        v-for="({ id, identity, name }) in filteredCategories"
        class="nav-category__item"
        :class="{
          'is-active': route.query.category === identity,
          'is-no-icon': !gameCategoriesObj[identity]?.icon
        }"
        @click="emit('clickCategory', identity)"
        :key="id"
        :data-identity="identity"
        ref="itemRef"
      >
        <atomic-icon
          :id="gameCategoriesObj[identity]?.icon"
          class="nav-category__item-icon"
        />
        <span class="nav-category__item-text">
          {{ gameCategoriesObj[identity]?.label || name }}
        </span>
      </div>
    </div>
    <div class="nav-category__actions">
      <button-categories @action="showCategories" :is-active="isDropdownShown"/>
      <button-providers @action="showModal('providers')"/>
      
      <ul
        v-if="isDropdownShown"
        class="nav-category__dropdown"
      >
        <li
          class="nav-category__dropdown-item"
          v-for="({ id, identity, name }) in dropdownItems"
          :class="{
            'is-active': route.query.category === identity,
            'is-no-icon': !gameCategoriesObj[identity]?.icon
          }"
          @click="clickCategory(identity)"
          :key="id"
        >
          <atomic-icon :id="gameCategoriesObj[identity]?.icon"/>
          <span class="nav-category__dropdown-item-text">
            {{ gameCategoriesObj[identity]?.label || name }}
          </span>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import type { ICollection } from '@skeleton/core/types';
  
  const props = defineProps<{
    hideItems?: boolean;
  }>();
  
  const { showModal } = useLayoutStore();
  const route = useRoute();
  const itemRef = ref([]);
  const itemsRef = ref();
  const isDropdownShown = ref<boolean>(false);
  
  const emit = defineEmits(['clickCategory']);
  const { gameCategoriesObj } = useGlobalStore();
  const filteredCategories = ref<ICollection[]>([]);
  const dropdownItems = ref<ICollection[]>([]);
  
  const showCategories = () => {
    window.innerWidth <= 1280 ? showModal('categories') : showDropdown();
  };
  
  const setDropdownItems = () => {
    if (props.hideItems) {
      dropdownItems.value = filteredCategories.value;
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
      
      dropdownItems.value = filteredCategories.value.filter(item => dropdownHiddenItems.includes(item.identity));
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
  
  onMounted(async () => {
    const { getCollectionsList } = useGamesStore();
    const gameCollections = await getCollectionsList();
    filteredCategories.value = gameCollections.filter((collection) => !collection.isHidden);
    window.addEventListener('resize', closeDropdown);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', closeDropdown);
  });
</script>

<style src="~/assets/styles/components/nav/category.scss" lang="scss"/>



