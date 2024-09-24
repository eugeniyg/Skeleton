<template>
  <div
    class="bonuses-package"
    :class="{ 'is-active': isPackageActive }"
    @click="emit('openPackageModal')"
  >
    <div class="bonuses-package__container">
      <div class="bonuses-package__header">
        <bonuses-badge-type :mode="-1" />
        <bonuses-badge-status :status="badgeStatus" />
      </div>

      <div class="bonuses-package__body">
        <!--
        <div v-if="props.packageImage" class="bonuses-package__img">
          <atomic-image :src="props.packageImage" />
        </div>
        -->

        <div class="bonuses-package__name">
          {{ packageName }}
        </div>

        <div class="bonuses-package__tb">
          <template v-for="(bonus, index) in props.list.slice(0, 5)" :key="bonus.id">
            <div class="bonuses-package__tb-th">
              {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.bonusLabel') }} {{ index + 1 }}:
            </div>

            <div class="bonuses-package__tb-td">
              <div
                v-if="![1,2].includes(bonus.status)"
                class="bonuses-package__item-status"
                :class="bonus.status === 3 && bonus.result === 2 ? 'is-done' : 'is-missed'"
              >
                <atomic-icon
                  :id="bonus.status === 3 && bonus.result === 2 ? 'done' : 'cross'"
                  class="bonuses-package__item-status-icon"
                />

                <span class="bonuses-package__item-status-label">
                  {{ bonus.status === 3 && bonus.result === 2
                    ? getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.playedLabel')
                    : getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'bonuses.missedLabel') }}
                </span>
              </div>

              <template v-if="!bonus.isDeposit && bonus.status === 2">
                <bonuses-freespin-progress
                  v-if="bonus.isFreeSpin"
                  :bonusInfo="bonus as IPlayerFreeSpin"
                />

                <bonuses-wager-progress v-else :bonusInfo="bonus as IPlayerBonus" />
              </template>

              <div v-if="bonus.isDeposit || bonus.status === 1" class="bonuses-package__not-received-label">
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

    </div>
  </div>
</template>

<script setup lang="ts">
  import type {IPlayerBonus, IPlayerFreeSpin} from "@skeleton/core/types";

  const props = defineProps<{
    list: Record<string, any>[];
    packageImage?: string;
  }>();

  const emit = defineEmits(['openPackageModal']);

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const
    {globalComponentsContent,
     defaultLocaleGlobalComponentsContent
    } = storeToRefs(globalStore);

  const packageName = computed(() => props.list[0].packageName || props.list[0].package.name);
  const isPackageActive = computed(() => {
    if (props.list[0].isDeposit) return false;
    return props.list.some(bonus => bonus.status === 2);
  });

  const badgeStatus = computed<'active'|'available'|'available-deposit'>(() => {
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
</script>

<style src="~/assets/styles/components/bonuses/package.scss" lang="scss"/>
