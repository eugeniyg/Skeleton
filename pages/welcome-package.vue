<template>
  <div>
    <div class="promotion">
      <h1 class="title">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
      </h1>

      <h4 class="sub-title">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'description') }}
      </h4>

      <div v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet')" class="steps">
        <div class="title">
          {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet.label') }}
        </div>

        <div class="items">
          <div v-for="(item, index) in howGetItems" :key="index" class="item">
            <span class="number">{{ index + 1 }}</span>
            <p class="text">{{ item }}</p>
          </div>
        </div>

        <atomic-picture
          v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet.image')"
          :src="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet.image')"
        />
      </div>

      <atomic-divider />

      <div class="welcome">
        <h4 class="title">
          {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'welcome.label') }}
        </h4>

        <div
          v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'welcome.items')?.length"
          class="items"
        >
          <div
            v-for="(card, itemIndex) in getContent(
              pageContent?.currentLocaleData,
              pageContent?.defaultLocaleData,
              'welcome.items'
            )"
            :key="itemIndex"
            class="item"
          >
            <div class="title">{{ card.title }}</div>
            <div class="sub-title">{{ card.topLabel }}</div>

            <atomic-picture :src="card.image" />

            <div class="actions">
              <div v-if="card.bonusId && bonusesStatus[card.bonusId] === 1" class="actions__success">
                <atomic-icon id="done" class="is-success" />
                <span>{{
                  getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'welcome.issued')
                }}</span>
              </div>

              <template v-else>
                <button-base
                  type="primary"
                  size="md"
                  :is-disabled="
                    loadStatuses ||
                    accountSwitching ||
                    (card.bonusId && bonusesStatus[card.bonusId] && [2, 4].includes(bonusesStatus[card.bonusId]))
                  "
                  @click="actionClick(card, itemIndex)"
                >
                  <atomic-spinner :is-shown="walletLoading === itemIndex" />
                  {{ card.buttonLabel }}
                </button-base>

                <button-base
                  type="ghost"
                  size="md"
                  :url="card.link.url"
                  :is-disabled="loadStatuses || accountSwitching"
                  :target-blank="card.link.targetBlank"
                >
                  {{ card.link.label }}
                </button-base>
              </template>
            </div>

            <div class="arrow">
              <atomic-icon id="arrow_expand-close" />
            </div>
          </div>
        </div>
      </div>

      <atomic-divider />

      <div class="bonuses">
        <h4 class="title">
          {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'bonuses.label') }}
        </h4>

        <div
          v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'bonuses.items')?.length"
          class="items"
        >
          <div
            v-for="(card, itemIndex) in getContent(
              pageContent?.currentLocaleData,
              pageContent?.defaultLocaleData,
              'bonuses.items'
            )"
            :key="itemIndex"
            class="item"
          >
            <div class="title">{{ card.subtitle }}</div>
            <div class="sub-title">{{ card.title }}</div>

            <atomic-picture :src="card.image" alt="" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openWalletModal('deposit') : openModal('sign-up')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base type="ghost" size="md" :url="card.link.url" :target-blank="card.link.targetBlank">
                {{ card.link.label }}
              </button-base>
            </div>
          </div>
        </div>
      </div>
    </div>

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IWelcomeBonusesPage } from '~/types';
  import { getBonusesStatus } from '@skeleton/api/bonuses';

  const { getContent, getMinBonusDeposit } = useProjectMethods();

  const contentParams = {
    contentKey: 'welcomePageContent',
    contentRoute: ['pages', 'welcome-bonuses'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IWelcomeBonusesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const howGetItems = computed(() => {
    if (pageContent.value?.currentLocaleData?.howGet || pageContent.value?.defaultLocaleData?.howGet) {
      return [
        getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'howGet.first'),
        getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'howGet.second'),
        getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'howGet.third'),
      ];
    }
    return [];
  });

  const profileStore = useProfileStore();
  const { openModal, openWalletModal } = useModalStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const walletStore = useWalletStore();
  const { activeAccount, accountSwitching } = storeToRefs(walletStore);
  const bonusesStatus = ref<Record<string, string>>({});
  const loadStatuses = ref<boolean>(true);
  const bonusStore = useBonusStore();
  const { depositBonuses, walletDepositBonus } = storeToRefs(bonusStore);

  const getStatuses = async (): Promise<void> => {
    const bonusesItems =
      getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'welcome.items') || [];
    const bonusIds = bonusesItems.map((item: any) => item.bonusId).filter(bonusId => !!bonusId);

    if (!isLoggedIn.value || !bonusIds.length) {
      bonusesStatus.value = [];
      loadStatuses.value = false;
      return;
    }

    loadStatuses.value = true;
    try {
      const statuses = await getBonusesStatus(bonusIds, activeAccount.value?.currency);
      const statusesObj = {};
      statuses.forEach(statusData => {
        statusesObj[statusData.id] = statusData.issueStatus;
      });
      bonusesStatus.value = statusesObj;
    } catch {
      console.error('Failed to get bonuses statuses');
      bonusesStatus.value = [];
    }
    loadStatuses.value = false;
  };

  watch(isLoggedIn, async () => {
    await getStatuses();
  });

  const mountedCompleted = ref<boolean>(false);

  watch(pageContent, async () => {
    if (mountedCompleted.value) await getStatuses();
  });

  const walletLoading = ref<string | undefined>();
  const actionClick = async (cardInfo: IWelcomeBonus, cardIndex: number): Promise<void> => {
    if (walletLoading.value !== undefined || accountSwitching.value) return;
    if (!isLoggedIn.value) {
      await openModal('sign-up');
      return;
    }
    walletLoading.value = cardIndex;

    if (cardInfo.bonusId) {
      const bonusData = depositBonuses.value.find(bonus => bonus.id === cardInfo.bonusId);
      if (bonusData) {
        const minDeposit = getMinBonusDeposit(bonusData);
        walletDepositBonus.value = { id: bonusData.id, packageId: bonusData.package?.id, amount: minDeposit?.amount };
      }
    }

    await openWalletModal('deposit');
    setTimeout(() => {
      walletLoading.value = undefined;
    }, 500);
  };

  onMounted(async () => {
    useListen('depositInvoiceUpdated', getStatuses);
    useListen('accountChanged', getStatuses);
    if (pageContent.value) await getStatuses();
    mountedCompleted.value = true;
  });

  onBeforeUnmount(() => {
    useUnlisten('depositInvoiceUpdated', getStatuses);
    useUnlisten('accountChanged', getStatuses);
  });
</script>

<style src="~/assets/styles/pages/welcome-package.scss" lang="scss" />
