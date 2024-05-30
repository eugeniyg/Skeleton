<template>
  <div class="sumsub-info">
    <sumsub-info-accordeon
      v-for="item in infoList"
      :title="item.title"
      :description="item.description"
    />
  </div>
</template>

<script setup lang="ts">
import type {IProfileSecurity} from "~/types";
import SumsubInfoAccordeon from "@skeleton/components/profile/sumsub-info-accordeon.vue";

const securityContent = ref<Maybe<IProfileSecurity>>(inject('securityContent'));
const defaultLocaleSecurityContent = ref<Maybe<IProfileSecurity>>(inject('defaultLocaleSecurityContent'));
const { getContent } = useProjectMethods();

const infoList = computed(() => {
  return getContent(securityContent.value, defaultLocaleSecurityContent.value, 'sumsub.infoList') || [];
})

</script>

<style src="~/assets/styles/components/profile/sumsub-info.scss" lang="scss" />