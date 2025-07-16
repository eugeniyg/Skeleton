<template>
  <div class="referral-rewards">
    <div class="referral-rewards__title">{{ title }}</div>

    <div class="referral-rewards__tb-wrapper">
      <table class="referral-rewards__tb">
        <thead>
          <tr class="referral-rewards__tr">
            <th class="referral-rewards__th">
              <span class="referral-rewards__th-bg">#</span>
            </th>
            <th v-for="column in columns" :key="column.key" class="referral-rewards__th">
              <span class="referral-rewards__th-bg">{{ column.title }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(column, index) in props.referralsList" :key="index" class="referral-rewards__tr">
            <td class="referral-rewards__td">
              <span class="referral-rewards__td-bg">{{ index + 1 }}</span>
            </td>
            <td class="referral-rewards__td">
              <span class="referral-rewards__td-bg" data-tooltip-parent>
                <atomic-icon
                  :id="getStatusIcon(column.qualified)"
                  class="referral-rewards__status-icon"
                  :class="getIconColor(column.qualified)"
                />
                <span class="referral-rewards__status-label">
                  {{ getQualifiedLabel(column.qualified) }}
                </span>
                <atomic-tooltip
                  v-if="column.qualified === 3"
                  :text="getContent(referralContent, defaultLocaleReferralContent, 'rewards.unqualifiedTooltip')"
                  icon="question"
                />
              </span>
            </td>
            <td class="referral-rewards__td">
              <span
                class="referral-rewards__td-bg"
                v-html="formatDateStr(dayjs(column.registrationDate).format(dateFormat))"
              />
            </td>
            <td class="referral-rewards__td">
              <span
                v-if="column.qualificationDate"
                class="referral-rewards__td-bg"
                v-html="formatDateStr(dayjs(column.qualificationDate).format(dateFormat))"
              />
              <span v-else class="referral-rewards__td-bg">-</span>
            </td>
            <td class="referral-rewards__td">
              <span v-if="!column.qualified">-</span>
              <span
                v-else-if="[2, 3].includes(column.qualified)"
                class="referral-rewards__td-bg"
                v-html="formatDateStr(dayjs(column.qualificationEndDate).format(dateFormat))"
              />
              <span v-else class="referral-rewards__td-bg">
                <referral-timer :expiredAt="column.qualificationEndDate" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <atomic-pagination
      v-if="props.pageMeta?.totalPages && props.pageMeta.totalPages > 1"
      v-bind="props.pageMeta"
      @select-page="emit('changePage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';
  import type { IReferralItem, IPaginationMeta } from '@skeleton/core/types';

  const props = defineProps<{
    referralsList: IReferralItem[];
    pageMeta: Maybe<IPaginationMeta>;
  }>();

  const referralContent = ref<Maybe<IProfileReferral>>(inject('referralContent'));
  const defaultLocaleReferralContent = ref<Maybe<IProfileReferral>>(inject('defaultLocaleReferralContent'));
  const { getContent } = useProjectMethods();
  const dayjs = useDayjs();
  const dateFormat = 'DD.MM.YYYY, HH:mm';
  const columnsOrder = ['qualified', 'registrationDate', 'qualificationDate', 'qualificationEndDate'];

  const title = computed(() => getContent(referralContent.value, defaultLocaleReferralContent.value, 'rewards.title'));

  const columns = computed(() =>
    columnsOrder.map(column => ({
      key: column,
      title: getContent(referralContent.value, defaultLocaleReferralContent.value, `rewards.columns.${column}`),
    }))
  );

  const statusMap: Record<number, { id: string; color: string; labelKey: string }> = {
    1: { id: 'clock', color: 'active', labelKey: 'inProgress' },
    2: { id: 'done', color: 'success', labelKey: 'qualified' },
    3: { id: 'cross', color: 'error', labelKey: 'unQualified' },
  };

  const getStatusIcon = (status: number): string => {
    return statusMap[status].id;
  };

  const getIconColor = (status: number): string => {
    return `is-${statusMap[status].color}`;
  };

  const formatDateStr = (str: string) => str.replace(',', ',</br>');

  const getQualifiedLabel = (status: number): string => {
    const key = statusMap[status].labelKey;
    return getContent(referralContent.value, defaultLocaleReferralContent.value, `rewards.statusLabels.${key}`);
  };

  const emit = defineEmits(['changePage']);
</script>

<style src="~/assets/styles/components/referral/rewards.scss" lang="scss" />
