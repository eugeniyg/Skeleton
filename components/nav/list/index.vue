<template>
  <div class="nav-list">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <template v-if="listItem?.items?.length">
        <div class="link" @click.prevent="toggleOpen" :class="{'is-open': open}">
          <atomic-icon :id="listItem.icon"/>
          <div class="text">{{ listItem.label }}</div>
          <button-toggle/>
        </div>

        <div class="items">
          <nuxt-link
            v-for="(link, itemIndex) in listItem.items"
            :key="itemIndex"
            class="link"
            :to="localizePath(link.url)"
          >
            <span class="text">{{ link.label }}</span>
          </nuxt-link>
        </div>
      </template>

      <div v-else class="link" @click="defineCurrentAction(listItem.url)">
        <atomic-icon :id="listItem.icon"/>
        <div class="text">{{ listItem.label }}</div>
      </div>

      <list-games
        v-if="listItem.gameList?.length"
        :items="listItem.gameList.slice(0, 3)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const open = ref<boolean>(props.isOpen);

  const toggleOpen = ():void => {
    open.value = !open.value;
  };

  const router = useRouter();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal } = useLayoutStore();

  const { localizePath } = useProjectMethods();
  const defineCurrentAction = (href: string):void => {
    if (!href) return;
    // specific actions like open modal etc
    if (!isLoggedIn.value && href === '/betting') {
      showModal('register');
    } else {
      // instead of <nuxt-link :to="href"
      router.push(localizePath(href));
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
