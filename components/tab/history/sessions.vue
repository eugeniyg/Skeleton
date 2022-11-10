<template>
  <div class="tab-history__tb">
    <div
      class="tb-sessions-history"
      @scroll="scrollAction"
      ref="tb"
      tabindex="0"
      data-tooltip-parent
    >
      <div class="row">
        <div
          v-for="(column, columnIndex) in headTitles"
          :key="columnIndex"
          class="th"
          v-html="column"
        />
      </div>

      <template v-if="sessions.length">
        <div v-for="session in sessions" :key="session.sessionId" class="row">
          <div class="td">
            <atomic-row-device :variant="session.deviceType === 'desktop' ? 'desktop' : 'mobile'"/>
          </div>

          <div class="td">{{ session.country }}</div>

          <div class="td">
            <atomic-row-user-agent :tooltip="session.userAgent">
              {{ shortUserAgent(session.userAgent) }}
            </atomic-row-user-agent>
          </div>

          <div class="td td-date">
            <span v-html="format(getFormatDate(session.createdAt))"></span>
          </div>

          <div class="td">
            <atomic-row-status
              :variant="sessionStatus(session)"
              :tooltip="session.closedAt ? `${getFormatDate(session.closedAt)}`: ''"
            >
              {{ sessionsContent.sessionsStatuses[sessionStatus(session)] }}
            </atomic-row-status>
          </div>

          <div class="td">
            <button-close-session
              v-if="sessionStatus(session) === 'active'"
              @click.once="closeSession(session.sessionId)"
            />
          </div>
        </div>
      </template>
    </div>

    <atomic-pagination
      v-if="pageMeta?.totalPages > 1"
      v-bind="pageMeta"
      @selectPage="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import parser from 'ua-parser-js';
  import {
    PaginationMetaInterface, SessionInterface,
  } from '@platform/frontend-core/dist/module';
  import { HistorySessionsInterface, HistoryTabInterface } from '~/types';

  const props = defineProps<{
    content: HistoryTabInterface,
  }>();

  const sessionsContent:HistorySessionsInterface = props.content.sessions;
  const headTitles = ['', ...Object.values(sessionsContent.tableColumns || {})];

  const { getUserSessions, closeActiveSession } = useCoreProfileApi();
  const sessions = ref<SessionInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const { getFormatDate } = useProjectMethods();

  const loading = ref<boolean>(true);
  const resolveSessionsRequest = async (page: number = 1):Promise<void> => {
    loading.value = true;
    const response = await getUserSessions(page, 10);
    sessions.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const { decodeToken } = useCoreMethods();
  const token = useCookie('bearer');
  const sessionStatus = (session: SessionInterface): string => {
    if (session.closedAt) return 'closed';
    const sessionId = decodeToken(token.value)?.sessionId;
    if (session.sessionId === sessionId) return 'current';
    return 'active';
  };

  const shortUserAgent = (userAgent: string):string => {
    const parsedUserAgent = parser(userAgent);
    return `${parsedUserAgent.browser?.name}, ${parsedUserAgent.os?.name} ${parsedUserAgent.os?.version}`;
  };

  const closeSession = async (sessionId: string):Promise<void> => {
    const response = await closeActiveSession(sessionId);
    const closedIndex = sessions.value.findIndex((session) => session.sessionId === sessionId);
    sessions.value[closedIndex] = response;
  };

  const changePage = (page: number):void => {
    if (loading.value) return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    resolveSessionsRequest(page);
  };

  const tb = ref<HTMLElement>();
  const state = reactive<any>({
    isScrolling: false,
    timeOut: null,
  });

  const scrollAction = () => {
    clearTimeout(state.timeOut);
    if (!state.isScrolling) {
      tb.value?.focus();
      state.isScrolling = true;
    }
    state.timeOut = setTimeout(() => {
      state.isScrolling = false;
    }, 200);
  };

  onMounted(() => {
    resolveSessionsRequest();
    window.addEventListener('scroll', scrollAction, false);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollAction);
  });

  const format = (str:string) => str.split(',').join('<br>');
</script>

<style lang="scss">
.tb-sessions-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  position: relative;
  padding-bottom: rem(8px);

  .td-date {
    span {
      @include font($body-1);
    }
  }

  .row {
    grid-template-columns:
      minmax(rem(52px), 1fr)
      minmax(rem(85px), 1fr)
      minmax(rem(190px), 1fr)
      minmax(rem(102px), 1fr)
      minmax(rem(106px), 1fr)
      minmax(rem(64px), 1fr);

    @include media(sm) {
      grid-template-columns:
      minmax(rem(52px), 1fr)
      minmax(rem(85px), 1fr)
      minmax(rem(285px), 1fr)
      minmax(rem(102px), 1fr)
      minmax(rem(106px), 1fr)
      minmax(rem(64px), 1fr);
    }
  }
}
</style>
