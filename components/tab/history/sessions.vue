<template>
  <div class="tab-history__tb">
    <div class="tb-sessions-history" tabindex="0" data-tooltip-parent>
      <div class="row">
        <div v-for="(column, columnIndex) in headTitles" :key="columnIndex" class="th">
          {{ column }}
        </div>
      </div>

      <template v-if="sessions.length">
        <div v-for="session in sessions" :key="session.sessionId" class="row">
          <div class="td">
            <atomic-row-device :variant="session.deviceType === 'desktop' ? 'desktop' : 'mobile'" />
          </div>

          <div class="td">{{ session.country }}</div>

          <div class="td">
            <atomic-row-user-agent :tooltip="session.userAgent">
              {{ shortUserAgent(session.userAgent) }}
            </atomic-row-user-agent>
          </div>

          <div class="td td-date" v-html="formatDateStr(dayjs(session.createdAt).format(dateFormat))" />

          <div class="td">
            <atomic-row-status
              :variant="sessionStatus(session)"
              :tooltip="session.closedAt ? `${dayjs(session.closedAt).format(dateFormat)}` : ''"
            >
              {{
                props.content?.sessionsStatuses[sessionStatus(session) as keyof ISessionsHistory['sessionsStatuses']]
              }}
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
      v-if="pageMeta?.totalPages && pageMeta.totalPages > 1"
      v-bind="pageMeta"
      @select-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import { UAParser } from 'ua-parser-js';
  import type { IPaginationMeta, ISession } from '@skeleton/api/types';
  import type { ISessionsHistory } from '~/types';
  import { getUserSessions, closeActiveSession } from '@skeleton/api/profile';

  const props = defineProps<{
    content: ISessionsHistory;
  }>();

  const dayjs = useDayjs();
  const headTitles = ['', ...Object.values(props.content?.tableColumns || {})];
  const dateFormat = 'DD.MM.YYYY, HH:mm';

  const sessions = ref<ISession[]>([]);
  const pageMeta = ref<IPaginationMeta>();

  const loading = ref<boolean>(true);
  const resolveSessionsRequest = async (page: number = 1): Promise<void> => {
    loading.value = true;
    const response = await getUserSessions(page, 10);
    sessions.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const { getCurrentSession } = useProfileStore();
  const currentSession = getCurrentSession();
  const sessionStatus = (session: ISession): string => {
    if (session.closedAt) return 'closed';
    const sessionId = currentSession ? currentSession.sessionId : undefined;
    if (session.sessionId === sessionId) return 'current';
    return 'active';
  };

  const shortUserAgent = (userAgent: string): string => {
    const parsedUserAgent = UAParser(userAgent);
    return `${parsedUserAgent?.browser?.name}, ${parsedUserAgent?.os?.name} ${parsedUserAgent?.os?.version}`;
  };

  const closeSession = async (sessionId: string): Promise<void> => {
    const response = await closeActiveSession(sessionId);
    const closedIndex = sessions.value.findIndex(session => session.sessionId === sessionId);
    sessions.value[closedIndex] = response;
  };

  const changePage = (page: number): void => {
    if (loading.value) return;
    window.scroll(0, 0);
    resolveSessionsRequest(page);
  };

  onMounted(() => {
    resolveSessionsRequest();
  });

  const formatDateStr = (str: string) => str.split(',').join(',<br>');
</script>

<style src="~/assets/styles/components/tab/history/sessions.scss" lang="scss" />
