<template>
  <vue-final-modal
    v-model="modals.questTasks"
    class="modal-quest-tasks"
    displayDirective="show"
    @closed="closedEvent"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @beforeOpen="beforeOpenHandle"
    @opened="openedHandle"
  >
    <div class="container">
      <button-modal-close :class="{ 'close-secondary': hasOffset }" @close="closeModal('questTasks');"/>
      
      <div class="scroll">
        <div class="modal-quest-tasks__card">
          <div class="header">
            <span v-if="showBackButton" class="header__back-btn" @click="showModal('questHub');">
              <span class="header__back-btn-icon">
                <atomic-icon id="arrow_previous"/>
              </span>
            </span>
            <span class="title">Unlock Slotsbet Loyalty</span>
          </div>
          
          <div class="modal-quest-tasks__img">
            <atomic-image src="/img/quest/quest-tasks-image-sample.png"/>
          </div>
          
          <div class="modal-quest-tasks__body">
            <quest-currency :items="questPopupCurrentTask.rewards"/>
            <quest-current-timer :expiredAt="questPopupCurrentTask.expiredAt"/>
          </div>
        </div>
        
        <div class="quest-tasks" :class="`is-${orderType}`">
          <div class="quest-tasks__count">List of tasks: {{ activeTasks.length }} more left</div>
          <div class="quest-tasks__items">
            <div class="quest-tasks__completed" v-if="completedTasks.length">
              <template v-for="(task, index) in completedTasks">
                <quest-task
                  :task="task"
                  icon-type="completed"
                  show-status-icon
                  show-progress-bar
                />
                <quest-tasks-header
                  v-if="activeTasks.length > 0 && completedTasks.length > 0 && index === completedTasks.length - 1"
                  title="You are here now!"
                />
              </template>
            </div>
            
            <div v-if="activeTasks.length" class="quest-tasks__next">
              <quest-tasks-header
                v-if="!completedTasks.length"
                title="You are here now!"
              />
              <template v-for="(task, index) in activeTasks">
                <quest-tasks-header
                  v-if="orderType === 'sequentially' && index === 1"
                  title="Next tasks:"
                />
                <quest-task
                  :task="task"
                  show-status-icon
                  show-progress-bar
                  :icon-type="(orderType === 'sequentially' && index === 0) ? 'next': (orderType === 'arbitrary') ? 'next' : 'locked'"
                  :bw-enabled="orderType === 'sequentially' && index > 0"
                />
              </template>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const {
    showModal,
    closeModal
  } = layoutStore;
  
  const hasOffset = ref<boolean>(false);
  const showBackButton = ref<boolean>(false);
  
  const {
    questPopupTasks,
    questPopupCurrentTask
  } = useFakeStore();
  
  const orderType: string = 'sequentially'; // sequentially'|'arbitrary'
  
  const completedTasks = questPopupTasks.filter(task => task.status === 'completed');
  const activeTasks = questPopupTasks.filter(task => task.status === 'active');
  
  const closedEvent = (): void => {
  };
  
  const beforeOpenHandle = () => {
    showBackButton.value = true;
  };
  
  const openedHandle = () => {
  };
</script>

<style src="~/assets/styles/components/modal/quest-tasks.scss" lang="scss"/>

