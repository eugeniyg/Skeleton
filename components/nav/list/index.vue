<template>
  <div class="nav-list">
    <div v-for="({ href, title, icon, bage, items, list }, index) in props.items" :key="index" class="item">
      <template v-if="items">
        <div class="link" @click.prevent="toggleOpen" :class="{'is-open': open}">
          <atomic-icon :id="icon"/>
          <div class="text">{{ title }}</div>
          <button-toggle/>
        </div>

        <div class="items">
          <nuxt-link
            v-for="({ title, href }, itemIndex) in items"
            :key="itemIndex"
            class="link"
            :to="href"
          >
            <span class="text">{{ title }}</span>
          </nuxt-link>
        </div>
      </template>

      <div v-else class="link" @click="defineCurrentAction(href)">
        <atomic-icon :id="icon"/>
        <div class="text">{{ title }}</div>
        <atomic-bage v-if="bage" :variant="bage.variant">{{ bage.text }}</atomic-bage>
      </div>

      <list-turbo-games v-if="list" :items="list" :is-compact="props.isCompact"/>
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

  const defineCurrentAction = (href: string):void => {
    // specific actions like open modal etc
    if (!isLoggedIn.value && href === '/betting') {
      showModal('register');
    } else {
      // instead of <nuxt-link :to="href"
      router.push(href);
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
