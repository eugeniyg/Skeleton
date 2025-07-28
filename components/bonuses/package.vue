<template>
  <div class="bonuses-package" :class="{ 'is-active': isPackageActive }" @click="emit('openPackageModal')">
    <div class="bonuses-package__container">
      <div class="bonuses-package__header">
        <bonuses-badge-type :mode="-1" />
        <bonuses-badge-status :status="badgeStatus" />
      </div>

      <div class="bonuses-package__body">
        <div class="bonuses-package__name">
          {{ packageName }}
        </div>

        <div class="bonuses-package__tb">
          <template v-for="(bonus, index) in props.list.slice(0, 5)" :key="bonus.id">
            <div class="bonuses-package__tb-th">
              {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.bonusLabel') }}
              {{ index + 1 }}:
            </div>

            <div class="bonuses-package__tb-td">
              <div
                v-if="bonus.status === 3"
                class="bonuses-package__item-status"
                :class="bonus.result === 2 ? 'is-done' : 'is-missed'"
              >
                <atomic-icon :id="bonus.result === 2 ? 'done' : 'cross'" class="bonuses-package__item-status-icon" />

                <span class="bonuses-package__item-status-label">
                  {{
                    getContent(
                      globalComponentsContent,
                      defaultLocaleGlobalComponentsContent,
                      `bonuses.bonusStatuses.${statusResult[bonus.result]}`
                    )
                  }}
                </span>
              </div>

              <template v-else-if="!bonus.isDeposit && bonus.status === 2">
                <bonuses-freespin-progress v-if="bonus.isFreeSpin" :bonus-info="bonus as IPlayerFreeSpin" />

                <bonuses-wager-progress v-else :bonus-info="bonus as IPlayerBonus" />
              </template>

              <div v-else class="bonuses-package__not-received-label">
                {{ bonus.name }}
              </div>
            </div>
          </template>
        </div>

        <div class="bonuses-package__footer">
          <div v-if="hiddenBonusesLabel" class="bonuses-package__footer-show-all">
            {{ hiddenBonusesLabel }}
          </div>

          <bonuses-info-button />
        </div>
      </div>

      <div v-if="!isPackageActive" class="bonuses-package__activator">
        <button-base
          class="bonuses-package__activate-btn"
          type="primary"
          size="md"
          :is-disabled="props.loading"
          @click.stop="emit('activate')"
        >
          <atomic-spinner :is-shown="props.loading" />
          {{ activateLabel }}
        </button-base>

        <bonuses-timer v-if="expiredDate" :expired-at="expiredDate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerBonus, IPlayerFreeSpin } from '@skeleton/api/types';

  const props = defineProps<{
    loading?: boolean;
    list: Record<string, any>[];
  }>();

  const emit = defineEmits(['openPackageModal', 'activate']);
  const statusResult: Record<number, string> = {
    '2': 'played',
    '3': 'canceled',
    '4': 'expired',
    '5': 'lost',
  };

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const packageName = computed(() => props.list[0].packageName || props.list[0].package.name);
  const isPackageActive = computed(() => {
    if (props.list[0].isDeposit) return false;
    return props.list.some(bonus => bonus.status === 2);
  });

  const badgeStatus = computed<'active' | 'available' | 'available-deposit'>(() => {
    if (isPackageActive.value) return 'active';
    if (props.list[0].isDeposit) return 'available-deposit';
    return 'available';
  });

  const hiddenBonusesLabel = computed(() => {
    if (props.list.length < 6) return undefined;
    const showAllLabel = getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'bonuses.showAll'
    );
    return showAllLabel.replace('{count}', props.list.length);
  });

  const activateLabel = computed<string>(() => {
    if (props.list[0].isDeposit)
      return getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        'bonuses.activateDeposit'
      );

    return getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'bonuses.activateCash'
    );
  });

  const expiredDate = computed<string | undefined>(() => {
    if (props.list[0].isDeposit && props.list[0].triggerConditions.availableTo) {
      return props.list[0].triggerConditions.availableTo;
    }

    if (props.list[0].status === 1 && props.list[0].activationExpiredAt) return props.list[0].activationExpiredAt;

    return undefined;
  });
</script>

<style src="~/assets/styles/components/bonuses/package.scss" lang="scss" />
