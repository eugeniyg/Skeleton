<template>
  <div class="documents-list">
    <div class="documents-list__items">
      <div
        class="documents-list__item"
        :class="{'is-selected':  props.selected === key}"
        v-for="{key, title, info, status} in items"
        @click="selectItem(key)"
      >
        <atomic-icon class="documents-list__item-icon" id="file" />
        
        <div class="documents-list__item-title">
          <span class="documents-list__item-title-text">{{ title }}</span>
          <atomic-icon v-if="status" :id="status"/>
        </div>
        <div class="documents-list__item-info" v-if="info">{{ info }}</div>
      
      </div>
    </div>
    
    <button-base type="primary" :is-disabled="!selectedItem">Continue</button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    selected: string
  }>();
  
  const emit = defineEmits(['change']);
  
  const selectedItem = ref<string>('');
  
  const items = [
    {
      key: 'passport',
      title: 'Passport',
      info: 'Subheading info',
      status: 'done'
    },
    {
      key: 'selfie_id_card',
      title: 'Seflie & ID card',
      info: 'Subheading info',
      status: 'warning'
    },
    {
      key: 'drivers_lincense',
      title: 'Drivers Lincense',
      info: 'Subheading info',
    },
    {
      key: 'address',
      title: 'Address',
      info: 'Subheading info',
    },
    {
      key: 'payments',
      title: 'Payments ',
      info: 'Subheading info',
    },
    {
      key: 'others',
      title: 'Others',
      info: 'Subheading info',
    },
  ];
  
  const selectItem = (key:string) => {
    selectedItem.value = key;
    emit('change', key);
  }
</script>

<style src="~/assets/styles/components/profile/documents-list.scss" lang="scss" />
