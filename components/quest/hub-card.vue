<template>
  <div class="quest-hub-card" @click="openTasksModal(props.questInfo, questImageSrc)">
    <div class="quest-hub-card__body">
      <div class="quest-hub-card__img">
        <atomic-image :src="questImageSrc" />
      </div>

      <div class="quest-hub-card__title">
        <span>{{ props.questInfo.name }}</span>

        <div class="quest-hub-card__tooltip">
          <atomic-icon id="info" />
        </div>
      </div>

      <div class="quest-hub-card__amount">
        <span class="quest-hub-card__amount-value">
          {{ rewardsValue[0].amount }}
        </span>

        <span class="quest-hub-card__amount-currency">
          {{ rewardsValue[0].currency }}
        </span>

        <span v-if="rewardsValue.length > 1" class="quest-hub-card__amount-more" @click.stop="openModal">
          +{{ rewardsValue.length - 1 }}
          {{ getContent(questsHubContent?.currentLocaleData, questsHubContent?.defaultLocaleData, 'moreLabel') }}
        </span>
      </div>

      <span class="quest-hub-card__arrow">
        <atomic-icon id="arrow_expand-close" />
      </span>
    </div>

    <hr class="quest-hub-card__divider" />
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuest } from '@skeleton/core/types';
  import type { IProfileInfo, IQuestsHubModal } from '~/types';

  const props = defineProps<{
    questInfo: IPlayerQuest;
    cardIndex: number;
  }>();

  const questsHubContentParams = {
    contentKey: 'modal-quests-hub',
    contentRoute: ['modals', 'quests-hub'],
  };
  const { getContentData: getQuestsHubContentData } = useContentLogic<IQuestsHubModal>(questsHubContentParams);
  const { data: questsHubContent } = await useLazyAsyncData(getQuestsHubContentData);

  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));

  const { getContent, formatBalance } = useProjectMethods();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const rewardsValue = computed(() => {
    const rewardsArr: { currency: string; amount: number }[] = [];
    for (const reward of props.questInfo.rewards) {
      const formatSumObj = formatBalance(reward.attributes.isoCode, reward.amount);
      if (reward.attributes.isoCode === activeAccount.value?.currency) rewardsArr.unshift(formatSumObj);
      else rewardsArr.push(formatSumObj);
    }
    return rewardsArr;
  });

  const questImages = computed(() => {
    const imgObjArr: { src: string }[] =
      getContent(
        questsHubContent.value?.currentLocaleData,
        questsHubContent.value?.defaultLocaleData,
        'questsImages'
      ) || [];
    return imgObjArr.map(imgObj => imgObj.src);
  });

  const questImageSrc = computed(() => {
    return (
      questImages.value[questImages.value.length - (props.cardIndex % questImages.value.length)] ||
      '/img/quests/default-quest-img.png'
    );
  });

  const { openRewardsModal, openTasksModal } = useQuestsStore();
  const rewardsModalTitle = computed(() => {
    return getContent(infoContent.value, defaultLocaleInfoContent.value, 'questsHub.rewardsTitle') || '';
  });
  const openModal = async (): Promise<void> => {
    await openRewardsModal(rewardsValue.value, rewardsModalTitle.value);
  };
</script>

<style src="~/assets/styles/components/quest/hub-card.scss" lang="scss" />
