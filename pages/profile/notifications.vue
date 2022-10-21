<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ notificationsContent?.title }}</h1>

      <form-input-dropdown
        value=""
        placeholder="View all"
        name="notification"
        :options="selects.notification"
        :is-disabled="!!selects.notification?.length"
      />
    </div>

    <list-notifications
      :items="items.notifications"
      :max="10"
      :isShowMarkReadBtn="!!items.notifications.length"
    />

    <button-load-more v-if="items.notifications.length"/>

    <atomic-empty
      v-if="!items.notifications.length"
      title="There is no data yet!"
      sub-title="You don`t  have any personal notification"
      variant="notification"
    />

  </div>
</template>

<script setup lang="ts">
  import { ProfileNotificationsInterface } from '~/types';

  const { selects, items } = useFakeStore();

  const globalStore = useGlobalStore();
  const notificationsContentRequest = await useAsyncData('notificationsContent', () => queryContent(`profile/${globalStore.currentLocale.code}`).only(['notifications']).findOne());
  const notificationsContent:ProfileNotificationsInterface|undefined = notificationsContentRequest.data.value?.notifications;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(notificationsContent?.seo);
</script>
