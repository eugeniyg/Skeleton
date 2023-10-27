<template>
  <vue-final-modal
    v-model="modals.exitCash"
    class="modal-exit-cash"
    :clickToClose="false"
    @clickOutside="closeModal('exitCash')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('exitCash')"/>
        <div class="title">Виникли проблеми з поповненням?</div>
      </div>

      <client-only>
        <div class="modal-exit-cash__content">
          <ul>
            <li>Спробуйте карту номер якої починається на “5” або “6”</li>
            <li>Перевірте правильність введених даних</li>
            <li>Переконайтеся в наявності необхідної суми на балансі</li>
          </ul>
        </div>
      </client-only>
      
      <div class="modal-exit-cash__actions">
        <button-base type="primary" size="md">Спробувати іншу карту</button-base>
        <button-base type="secondary" size="md">Змінити метод поповнення</button-base>
        <button-base size="xs" type="ghost">Відмінити поповнення</button-base>
      </div>
      
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/exit-cash.scss" lang="scss" />

