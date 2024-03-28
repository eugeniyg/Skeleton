<template>
  <div class="nav-list">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <atomic-menu-category v-if="listItem?.items?.length" v-bind="listItem" />
      
      <div
        v-else
        class="link"
        @click="defineCurrentAction(listItem.url)"
        :class="{'is-active': route.fullPath === localizePath(listItem.url)}"
      >
        <atomic-svg
          v-if="listItem?.displayCustomIcon && listItem?.customIcon"
          :src="listItem?.customIcon"
        />
        <atomic-icon v-else :id="listItem?.icon ? listItem?.icon : 'dot-md'"/>
        
        <div class="text">{{ listItem.label }}</div>

        <client-only>
          <div v-if="listItem.counter" class="counter">{{ listItem.counter }}</div>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: any;
  }>();
  
  const router = useRouter();
  const route = useRoute();

  const { localizePath } = useProjectMethods();

  const defineCurrentAction = (href: string): void => {
    if (!href) return;
    router.push(localizePath(href));
  };
</script>

<style src="~/assets/styles/components/nav/list.scss" lang="scss"/>
