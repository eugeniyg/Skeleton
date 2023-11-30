<template>
  <div class="documents">
    <div class="documents__header">
      <div class="documents__step-back" v-if="selectedDocType">
        <atomic-icon id="arrow_previous"/>
      </div>
      <span class="documents__header-title">Step 1: Select document type</span>
    </div>
    
    <profile-documents-list @change="selectDocType" :selected="selectedDocType"/>
    
    <!-- passport / id / driver license -->
    
    <div class="documents__samples">
      <div class="documents__samples-item" v-for="{img, title, icon} in docSamples">
        <div class="documents__samples-item-img">
          <atomic-image :src="`/img/documents/${img}.png`"/>
        </div>
        
        <atomic-icon :id="icon"/>
        
        <div class="documents__samples-item-title">{{ title }}</div>
      </div>
    </div>
    
    <!-- passport / id /driver license -->
  </div>
</template>

<script setup lang="ts">
  const selectedDocType = ref<string>('');
  
  const selectDocType = (type: string) => {
    selectedDocType.value = type;
  };
  
  const docSamples = [
    {
      img: 'good',
      title: 'Good',
      icon: 'done'
    },
    {
      img: 'not-cut',
      title: 'Not cut',
      icon: 'warning'
    },
    {
      img: 'not-blurry',
      title: 'Not blurry',
      icon: 'warning'
    },
    {
      img: 'not-reflective',
      title: 'Not reflective',
      icon: 'warning'
    },
  ];
</script>

<style src="~/assets/styles/components/profile/documents.scss" lang="scss"/>