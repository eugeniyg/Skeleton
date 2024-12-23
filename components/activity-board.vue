<template>
  <div class="activity-board">
    <div class="activity-board__header">
      <atomic-icon v-if="props.icon" :id="props.icon" class="activity-board__header-icon" />
      <div class="activity-board__header-title">{{ props.title }}</div>

      <div v-click-outside="hideNav" class="activity-board__nav" :class="{ 'is-open': isOpen }">
        <div class="activity-board__nav-selected" @click="toggleMobileNav">
          <span class="activity-board__nav-selected-title">{{ selectedNavTitle }}</span>
          <atomic-icon id="arrow_expand-close" />
        </div>

        <div class="activity-board__nav-items">
          <div
            v-for="board in boards"
            :key="board.id"
            class="activity-board__nav-item"
            :class="{ 'is-active': board.id === selectedNavItem }"
            @click="selectNavItem(board.id)"
          >
            <span>{{ board.title }}</span>
            <atomic-icon v-if="board.id === selectedNavItem" id="check" />
          </div>
        </div>
      </div>
    </div>

    <div class="activity-board__tb-scroll">
      <div class="activity-board__tb">
        <div class="activity-board__tb-head">
          <span
            v-for="(column, index) in tbColumns"
            :key="column.id"
            class="activity-board__tb-th"
            :class="`th-${index + 1}`"
          >
            {{ column.label }}
          </span>
        </div>

        <div class="activity-board__tb-body animate" :class="{ push: isAnimate }" @animationend="onAnimationEnd">
          <div v-for="row in boardData" :key="row.id" class="activity-board__tb-row">
            <div
              v-for="({ id }, index) in tbColumns"
              :key="id"
              class="activity-board__tb-td"
              :class="`td-${index + 1}`"
            >
              <template v-if="id === 'game'">
                <atomic-image
                  :src="getImageUrl(row.customImages, row.gameImages, 'square')"
                  class="activity-board__tb-td-img"
                />
                <span>{{ row.gameName }}</span>
              </template>

              <template v-else-if="id === 'nickname'">
                <span>{{ row.nickname || 'Unknown' }}</span>
              </template>

              <template v-else-if="id === 'createdAt'">
                <span>{{ dayjs(row.createdAt).format('hh:mm:ss A') }}</span>
              </template>

              <template v-else-if="['amount', 'baseCurrencyAmount', 'payout'].includes(id)">
                <atomic-image
                  class="activity-board__tb-td-icon"
                  :src="`/img/currency/${id === 'baseCurrencyAmount' ? baseCurrency?.code : row.currency}.svg`"
                  default-image="/img/currency/placeholder.svg"
                />
                <span>{{ row[id] }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IEventBet, IWebSocketResponse } from '@skeleton/core/types';
  import type { IHomePage } from '~/types';

  const props = defineProps<{
    title?: string;
    icon?: string;
    columns: IHomePage['activityBoard']['columns'];
    boards: { title: string; id: string }[];
  }>();

  const { getImageUrl } = useProjectMethods();
  const boardSubscription = ref<any>();
  const boardData = reactive<IEventBet[]>([]);
  const globalStore = useGlobalStore();
  const { baseCurrency } = storeToRefs(globalStore);
  const dayjs = useDayjs();

  const handleBoardsEvent = async (socketData: IWebSocketResponse): void => {
    const betData = socketData.data.bet;
    if (betData) {
      boardData.unshift(betData);
      if (boardData.length > 11) boardData.pop();
      await nextTick();
      isAnimate.value = true;
    }
  };

  const unsubscribeBoardSocket = (): void => {
    if (boardSubscription.value) {
      boardSubscription.value.unsubscribe();
      boardSubscription.value.removeAllListeners();
    }
  };

  const subscribeBoardSocket = async (boardId: string): Promise<void> => {
    unsubscribeBoardSocket();
    const { createSubscription } = useWebSocket();
    boardSubscription.value = createSubscription(`activity-board:boards#${boardId}`, handleBoardsEvent);
    const resp: { publications: IWebSocketResponse[] } = await boardSubscription.value.history({
      limit: 11,
      since: null,
      reverse: true,
    });
    const betsArr = resp.publications.map(historyObj => historyObj.data.bet as IEventBet);
    boardData.splice(0, 20, ...betsArr);
  };

  const tbColumns = computed(() => {
    if (!props.columns) return [];

    return Object.keys(props.columns).map(key => ({
      label:
        key === 'baseCurrencyAmount'
          ? props.columns[key].replace('{currency}', baseCurrency.value?.code || '') || key
          : props.columns[key] || key,
      id: key,
    }));
  });

  const isOpen = ref<boolean>(false);
  const selectedNavItem = ref<string>(props.boards[0]?.id);
  const isAnimate = ref<boolean>(false);

  const selectedNavTitle = computed(() => {
    return props.boards.find(board => board.id === selectedNavItem.value)?.title;
  });

  const toggleMobileNav = () => {
    isOpen.value = !isOpen.value;
  };

  const selectNavItem = (id: string) => {
    selectedNavItem.value = id;
    subscribeBoardSocket(id);
  };

  const hideNav = () => {
    isOpen.value = false;
  };

  const onAnimationEnd = () => {
    isAnimate.value = false;
  };

  onMounted(() => {
    subscribeBoardSocket(selectedNavItem.value);
  });
</script>

<style src="~/assets/styles/components/activity-board.scss" lang="scss" />
